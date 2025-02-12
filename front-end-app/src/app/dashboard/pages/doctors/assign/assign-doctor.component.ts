import { Component } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-doctor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assign-doctor.component.html',
  styleUrl: './assign-doctor.component.css'
})
export class AssignDoctorComponent {

  patientId?: number;
  doctorId?: string;
  message: string = '';

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  assignDoctor(): void {
    if (!this.patientId || !this.doctorId) {
      this.message = "Veuillez renseigner les informations du patient et du médecin.";
      return;
    }

    this.userService.assignDoctor(this.patientId, this.doctorId).subscribe({
      next: (response) => {
        // Si la réponse est OK (200), le message de succès est renvoyé
        console.log('assign response', response);
        this.toastr.success(response.message || 'Le médecin a été assigné avec succès au patient.', 'Assign Successful');
      },
      error: (error) => {
        // Gérer les erreurs basées sur le code de statut
        if (error.status === 400) {
          // Par exemple, une mauvaise requête (BadRequest)
          this.toastr.error(error.error, 'Assign Failed');
        } else if (error.status === 404) {
          // Par exemple, non trouvé (NotFound)
          this.toastr.error(error.error, 'Assign Failed');
        } else {
          // Gestion générale des erreurs
          this.toastr.error(error.message || 'Une erreur est survenue.', 'Assign Failed');
        }
      }
    });
    
  }

}
