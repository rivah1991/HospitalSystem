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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';


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

  patientId: number | null = null; // ID patient variable
  userId: string | null = null;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) {}
  decodeToken: any;

  ngOnInit(): void {

    const token = this.authService.getToken();
  
    if (token) {
      this.decodeToken = jwtDecode(token);
      console.log('user token',this.decodeToken);
    this.userId = this.decodeToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    // this.userId = this.decodeToken['sub']; 
    console.log('user Id',this.userId);
    const role = this.decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    } else {
      console.error('Token non trouvé');
    }

    this.patientForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
      // mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile: ['', [Validators.required, Validators.pattern('^\\(\\d{3}\\) \\d{3}-\\d{4}$')]],
//       (123) 456-7890
// (987) 654-3210
// (555) 123-4567
      maritalStatus: [''],
      occupation: [''],
      bloodGroup: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: ['', Validators.required],
      gender: ['', Validators.required],
    });

     // Check if a patient ID has been passed in the URL (for an update)
      this.activatedRoute.params.subscribe(params => {
        if (params['id']) {
          this.patientId = +params['id']; 
          this.loadPatientData(); 
        }
    });


    // Force le rafraîchissement de l'affichage
  this.cdr.detectChanges();

  }

   // Charger les données du patient pour la mise à jour
   loadPatientData(): void {
    if (this.patientId) {
      this.authService.getPatientById(this.patientId).subscribe(patient => {
        // Remplir le formulaire avec les données du patient
        this.patientForm.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: patient.age,
          email: patient.email,
          mobile: patient.mobile,
          maritalStatus: patient.maritalStatus,
          occupation: patient.occupation,
          bloodGroup: patient.bloodGroup,
          address: patient.address,
          city: patient.city,
          state: patient.state,
          postalCode: patient.postalCode,
          gender: patient.gender
        });
      });
    }
  }

  
 
  savePatient() {
    if (this.patientForm.invalid) {
      return; // Si le formulaire est invalide, ne rien faire
    }

    const formData = this.patientForm.value;
    const patientData = {
      id: this.patientId || 0, // Si un ID existe, on l'utilise, sinon on met 0 pour un nouvel ajout
      userId: this.userId,
      user: { id: this.userId },
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: Number(formData.age),
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

    // Si patientId existe, on met à jour, sinon on ajoute un patient
    if (this.patientId) {
      this.authService.updatePatient(this.patientId, patientData).subscribe({
        next: (response) => {
          this.toastr.success('Patient updated successfully!', 'Update Successful');
          // this.router.navigate(['/dashboard/patients/recommendations']);
          this.router.navigate(['/dashboard/patients/list']);
        },
        error: (error) => {
          this.toastr.error('Error updating patient.', 'Update Failed');
        }
      });
    } else {
      console.log(patientData);
      this.authService.addPatient(patientData).subscribe({
        next: (response) => {
          this.toastr.success('Patient added successfully!', 'Registration Successful');
          const createdPatientId = response.id;
          if (createdPatientId) {
            this.router.navigate([`/dashboard/patients/recommendations/${createdPatientId}`]);
          } else {
            this.toastr.error('Error: Patient ID not found.', 'Error');
          }
        },
        error: (error) => {
          console.error('Error adding patient:', error);
          this.toastr.error('Error adding patient.', 'Registration Failed');
        }
      });
    }
  }
 
  goBack() {
    this.router.navigate(['/dashboard/patients/list']);
  }
}
