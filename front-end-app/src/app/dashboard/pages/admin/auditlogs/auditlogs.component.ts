import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-auditlogs',
  standalone: true,
  imports: [MatTableModule,DatePipe,MatSortModule,MatPaginatorModule,MatCardModule],
  templateUrl: './auditlogs.component.html',
  styleUrl: './auditlogs.component.css'
})
export class AuditlogsComponent implements OnInit {
   
  constructor(private authService: AuthService) {}
  auditEntries: any[] = [];

  displayedColumns: string[] = ['action', 'user', 'description','timestamp']

  // auditEntries = [
  //   { id: 1, action: 'Patient creation', user: 'admin', timestamp: new Date() },
  //   { id: 2, action: 'Patient editing', user: 'doctor1', timestamp: new Date() },
  //   { id: 3, action: 'Patient Deletion', user: 'admin', timestamp: new Date() },
  // ];

  dataAudit = new MatTableDataSource(this.auditEntries);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;  // Utilisation du modificateur `!` pour indiquer que cette propriété sera définie plus tard
  
    ngAfterViewInit() {
      this.dataAudit.paginator = this.paginator;
    }
 

    ngOnInit(): void {

      this.authService.getAuditLogs().subscribe((data: any) => {
        // console.log('data audi', data)
        this.auditEntries = data;  // Mettre à jour les logs d'audit récupérés
        this.dataAudit.data = this.auditEntries; // Mettre à jour la source de données
      });
    }
}