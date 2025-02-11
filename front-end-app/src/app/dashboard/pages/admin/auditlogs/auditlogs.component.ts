import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-auditlogs',
  standalone: true,
  imports: [MatTableModule, DatePipe, MatSortModule, MatPaginatorModule, MatCardModule],
  templateUrl: './auditlogs.component.html',
  styleUrl: './auditlogs.component.css'
})
export class AuditlogsComponent implements OnInit {
  constructor(private authService: AuthService) {}

  auditEntries: any[] = [];
  displayedColumns: string[] = ['action', 'user', 'description', 'timestamp'];

  dataAudit = new MatTableDataSource(this.auditEntries);

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Utilisation du modificateur `!` pour indiquer que cette propriété sera définie plus tard

  decodeToken: any;
  usernameFromToken: any;

  ngAfterViewInit() {
    this.dataAudit.paginator = this.paginator;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.decodeToken = jwtDecode(token);
      // console.log(decoded);  // Affichez les données du token

      this.usernameFromToken = this.decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }

    this.authService.getAuditLogs().subscribe((data: any) => {
      console.log('data:', data);
      console.log('Username from token:', this.usernameFromToken);

      this.auditEntries = data.map((entry: any) => {
        if (entry.userId === this.decodeToken.sub) {
          console.log('successful');
          entry.userId = this.usernameFromToken;
          entry.description = entry.description.replace(entry.description.split(' ')[0], this.usernameFromToken); 
        }
        return entry; // Assurez-vous de retourner l'élément modifié
      });

      this.dataAudit.data = this.auditEntries; // Mettre à jour la source de données
    });
  }
}
