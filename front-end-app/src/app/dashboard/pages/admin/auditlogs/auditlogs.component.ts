import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auditlogs',
  standalone: true,
  imports: [MatTableModule,DatePipe,MatSortModule,MatPaginatorModule,MatCardModule],
  templateUrl: './auditlogs.component.html',
  styleUrl: './auditlogs.component.css'
})
export class AuditlogsComponent implements OnInit {
   
  constructor() {}

  displayedColumns: string[] = ['action', 'user', 'timestamp']

  auditEntries = [
    { id: 1, action: 'Patient creation', user: 'admin', timestamp: new Date() },
    { id: 2, action: 'Patient editing', user: 'doctor1', timestamp: new Date() },
    { id: 3, action: 'Patient Deletion', user: 'admin', timestamp: new Date() },
    { id: 4, action: 'Patient creation', user: 'admin', timestamp: new Date() },
    { id: 5, action: 'Patient editing', user: 'doctor1', timestamp: new Date() },
    { id: 6, action: 'Patient Deletion', user: 'admin', timestamp: new Date() },
    { id: 7, action: 'Patient creation', user: 'admin', timestamp: new Date() },
    { id: 8, action: 'Patient editing', user: 'doctor1', timestamp: new Date() },
    { id: 9, action: 'Patient Deletion', user: 'admin', timestamp: new Date() },
  ];

  dataAudit = new MatTableDataSource(this.auditEntries);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;  // Utilisation du modificateur `!` pour indiquer que cette propriété sera définie plus tard
  
    ngAfterViewInit() {
      this.dataAudit.paginator = this.paginator;
    }
 

    ngOnInit(): void {}
}