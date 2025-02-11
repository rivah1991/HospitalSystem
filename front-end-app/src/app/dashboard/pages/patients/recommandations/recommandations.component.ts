import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AddRecommandationsComponent } from '../add-recommandations/add-recommandations.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeStatusModalComponentComponent } from './change-status-modal-component/change-status-modal-component.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recommandations',
  standalone: true,
  imports: [MatTableModule,MatCardModule,MatIconModule,CommonModule],
  templateUrl: './recommandations.component.html',
  styleUrl: './recommandations.component.css'
})
export class RecommandationsComponent implements OnInit {



  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  patientId: number | null = null;
  recommendations: any[] = [];
     // Définir les colonnes à afficher dans le tableau
  displayedColumns: string[] = ['patientId', 'type', 'description', 'statut'];
  
  ngOnInit(): void {
    const idTest = this.activatedRoute.snapshot.paramMap.get('id');
    if (idTest) {
      this.patientId = +idTest;
      this.loadRecommandations(this.patientId);
    }
  }


  openRecommendationModal(): void {
    const id = this.patientId;
    // const dialogRef = this.dialog.open(AddRecommandationsComponent);
    const dialogRef = this.dialog.open(AddRecommandationsComponent, {
      data: {
        patientId: id // Passer l'ID du patient ici
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed');
      // Ajoutez ici des actions après la fermeture du modal
    });
  }

    // Définir les données des recommandations (exemple de données)
    // recommendations = [
    //   { patientId: 1, type: 'Consultation', description: 'Initial check-up', statut: 'Completed' },
    //   { patientId: 2, type: 'Follow-up', description: 'Post-surgery visit', statut: 'Pending' },
    //   { patientId: 3, type: 'Emergency', description: 'Acute pain', statut: 'In Progress' }
    // ];
    
   

   

  goBack() {
    this.router.navigate(['/dashboard/patients/list']);
  }

 

  loadRecommandations(patientId: number): void {
    if (!patientId) return;

    this.authService.getRecommandationsByPatientId(patientId).subscribe({
      next:(data)=>{
        this.recommendations = data                 
      },
      error: err => {
        console.error("Error loading recommendations", err) ;
      }
    })
   
  }
   // Ouvrir le modal pour changer le statut
   openChangeStatusModal(recommendation: any): void {
    const dialogRef = this.dialog.open(ChangeStatusModalComponentComponent, {
      // data: recommendation // Passer les données nécessaires au modal
      data: {
        statut: recommendation.statut, // Passer le statut actuel
      }
    });

    

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // Mise à jour du statut après la modification
  //       const index = this.recommendations.findIndex(r => r.patientId === recommendation.patientId);
  //       if (index !== -1) {
  //         this.recommendations[index].statut = result; // Mettre à jour le statut
  //       }
  //     }
  //   });
  // }

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Appeler le service pour mettre à jour le statut de la recommandation
      this.authService.updateRecommendationStatus(recommendation.patientId, recommendation.id, result).subscribe({
        next: (updatedRecommendation) => {
          // Mettre à jour le statut dans le tableau local après le changement
          const index = this.recommendations.findIndex(r => r.patientId === recommendation.patientId && r.id === recommendation.id);
          if (index !== -1) {
            console.log('test sucess')
            this.recommendations[index].statut = result; // Mettre à jour le statut
            this.toastr.success('Recommendation Successful!', 'Successful');
          }
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour du statut", err);
          this.toastr.error('Recommendation Failed!', 'Error');
        }
      });
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
