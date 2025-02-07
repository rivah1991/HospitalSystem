import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recommandations',
  standalone: true,
  imports: [MatTableModule,MatCardModule],
  templateUrl: './recommandations.component.html',
  styleUrl: './recommandations.component.css'
})
export class RecommandationsComponent {
  constructor(public dialog: MatDialog) {}


    // Définir les données des recommandations (exemple de données)
    recommendations = [
      { patientId: 1, type: 'Consultation', description: 'Initial check-up', statut: 'Completed' },
      { patientId: 2, type: 'Follow-up', description: 'Post-surgery visit', statut: 'Pending' },
      { patientId: 3, type: 'Emergency', description: 'Acute pain', statut: 'In Progress' }
    ];
    
      // Définir les colonnes à afficher dans le tableau
  displayedColumns: string[] = ['patientId', 'type', 'description', 'statut'];

}
