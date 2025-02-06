import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatTableModule,DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['action', 'user', 'timestamp']
  
  pendingActions = [
    { id: 1, action: 'Création du patient', user: 'admin', timestamp: new Date(), status: 'pending' },
    { id: 2, action: 'Modification des informations du patient', user: 'doctor1', timestamp: new Date(), status: 'pending' },
  ];

  constructor() {}

  ngOnInit() {
    // Pas d'appel API ici, les données sont statiques
  }

  approveAction(id: number) {
    const action = this.pendingActions.find(a => a.id === id);
    if (action) {
      action.status = 'approved'; // Met à jour le statut
    }
  }

  rejectAction(id: number) {
    const action = this.pendingActions.find(a => a.id === id);
    if (action) {
      action.status = 'rejected'; // Met à jour le statut
    }
  }
} 