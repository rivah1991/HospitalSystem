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
        console.log('assign response', response)
        this.toastr.success('The doctor has been successfully assigned to the patient!', 'Assign Successful');
        
      },
      error: (error) => {
        this.message = error.message || 'Une erreur est survenue.';
        this.toastr.error('Error assign patient.', 'Assign Failed');
      }
    });
  }

}
