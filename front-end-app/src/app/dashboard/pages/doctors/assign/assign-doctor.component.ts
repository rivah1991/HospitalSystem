import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-doctor',
  standalone: true,
  imports: [
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    MatSelectModule, 
    MatButtonModule, 
    MatSnackBarModule, 
    ReactiveFormsModule
  ],
  templateUrl: './assign-doctor.component.html',
  styleUrls: ['./assign-doctor.component.css']
})
export class AssignDoctorComponent implements OnInit {

  recommendationForm: FormGroup; // FormGroup pour gérer le formulaire
  message: string = '';
  patientId!: number;
  
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder, // FormBuilder pour créer des formulaires réactifs
    public dialogRef: MatDialogRef<AssignDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialisation du formulaire
    this.recommendationForm = this.fb.group({
      patientId: [{ value: this.data.patientId, disabled: true }, Validators.required],
      doctorId: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data && this.data.patientId) {
      this.patientId = this.data.patientId;  // Assigning the patientId passed from parent
    }

    console.log('id patient', this.patientId)

  }

  assignDoctor(): void {
    if (this.recommendationForm.invalid) {
      this.message = 'Veuillez renseigner les informations du patient et du médecin.';
      return;
    }

    const { patientId, doctorId } = this.recommendationForm.value;

    this.userService.assignDoctor(this.patientId, doctorId).subscribe({
      
      next: (response) => {
        console.log('patientId', this.patientId);
        this.toastr.success(response.message || 'Le médecin a été assigné avec succès au patient.', 'Assign Successful');
        this.dialogRef.close(); // Ferme le modal après succès
      },
      error: (error) => {
        if (error.status === 400) {
          this.toastr.error(error.error, 'Assign Failed');
        } else if (error.status === 404) {
          this.toastr.error(error.error, 'Assign Failed');
        } else {
          this.toastr.error(error.message || 'Une erreur est survenue.', 'Assign Failed');
        }
      }
    });
  }

  close(): void {
    this.dialogRef.close(); // Ferme le modal sans faire d'action
  }
}
