import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ✅ Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,   
    MatSelectModule,
    MatRadioModule,
    MatIconModule,    
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
  ],
  templateUrl: './add.component.html',
  // styleUrl: ['./add.component.css', '/patients.component.css']
  styleUrls: ['./add.component.css', '../patients.component.css']

})
export class AddPatientComponent implements OnInit {

  patientForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.patientForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      maritalStatus: [''],
      occupation: [''],
      bloodGroup: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: ['', Validators.required],
      gender: ['', Validators.required],
    });

    // Force le rafraîchissement de l'affichage
  this.cdr.detectChanges();

  }


  createPatient() {
    // Appel à la méthode pour ajouter un patient
    const formData = this.patientForm.value;
   
    const patientData = {
      id: 0, // ✅ L'API attend un `id`
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: Number(formData.age), // ✅ `age` en `number`
      gender: formData.gender,
      email: formData.email,
      mobile: formData.mobile,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: String(formData.postalCode) 
    };

    console.log('data patient',patientData);
    this.authService.addPatient(patientData).subscribe({
      next: (response) => {
        console.log('Patient added successfully', response);       
        this.toastr.success('New patient created!', 'Registration Successful');
        this.router.navigate(['/dashboard/patients/recommendations']); // Rediriger vers la page suivante après ajout
      },
      error: (error) => {
        console.error('Error adding patient', error);
        
        this.toastr.error('Patient error.', 'Registration Failed');
      }
    });
  }
 
  goBack() {
    this.router.navigate(['/dashboard/patients/list']);
  }
}
