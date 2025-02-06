import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-auditlogs',
  standalone: true,
  imports: [MatTableModule,DatePipe],
  templateUrl: './auditlogs.component.html',
  styleUrl: './auditlogs.component.css'
})
export class AuditlogsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'user', 'timestamp']

  auditEntries = [
    { id: 1, action: 'Création du patient', user: 'admin', timestamp: new Date() },
    { id: 2, action: 'Modification des informations du patient', user: 'doctor1', timestamp: new Date() },
    { id: 3, action: 'Suppression du patient', user: 'admin', timestamp: new Date() },
  ];

  constructor() {}

  ngOnInit() {
    // Pas d'appel API ici, les données sont statiques
  }
}