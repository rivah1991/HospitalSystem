import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AddRecommandationsComponent } from '../add-recommandations/add-recommandations.component';
import { Router } from '@angular/router';
import { ChangeStatusModalComponentComponent } from './change-status-modal-component/change-status-modal-component.component';

@Component({
  selector: 'app-recommandations',
  standalone: true,
  imports: [MatTableModule,MatCardModule,MatIconModule,CommonModule],
  templateUrl: './recommandations.component.html',
  styleUrl: './recommandations.component.css'
})
export class RecommandationsComponent {
  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {}

  openRecommendationModal(): void {
    const dialogRef = this.dialog.open(AddRecommandationsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed');
      // Ajoutez ici des actions après la fermeture du modal
    });
  }

    // Définir les données des recommandations (exemple de données)
    recommendations = [
      { patientId: 1, type: 'Consultation', description: 'Initial check-up', statut: 'Completed' },
      { patientId: 2, type: 'Follow-up', description: 'Post-surgery visit', statut: 'Pending' },
      { patientId: 3, type: 'Emergency', description: 'Acute pain', statut: 'In Progress' }
    ];
    
      // Définir les colonnes à afficher dans le tableau
  displayedColumns: string[] = ['patientId', 'type', 'description', 'statut'];

  goBack() {
    this.router.navigate(['/dashboard/patients/list']);
  }

   // Ouvrir le modal pour changer le statut
   openChangeStatusModal(recommendation: any): void {
    const dialogRef = this.dialog.open(ChangeStatusModalComponentComponent, {
      // data: recommendation // Passer les données nécessaires au modal
      data: {
        statut: recommendation.statut, // Passer le statut actuel
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mise à jour du statut après la modification
        const index = this.recommendations.findIndex(r => r.patientId === recommendation.patientId);
        if (index !== -1) {
          this.recommendations[index].statut = result; // Mettre à jour le statut
        }
      }
    });
  }


  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return '';
    }
  }
  

}
