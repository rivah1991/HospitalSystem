import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-add-recommandations',
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
  templateUrl: './add-recommandations.component.html',
  styleUrls: ['./add-recommandations.component.css']
})
export class AddRecommandationsComponent implements OnInit{
  recommendationForm: FormGroup;
  patientId!: number;
  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<AddRecommandationsComponent>,
    // Injects data transmitted when the modal is opened (e.g. patient ID)
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute 
   
  ) {
    this.recommendationForm = this.fb.group({
      patientId: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      statut: ['Pending', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data && this.data.patientId) {
      this.patientId = this.data.patientId;  // Assigning the patientId passed from parent
    }

    console.log('id patient', this.patientId)

    this.recommendationForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      statut: ['Pending', Validators.required]
    });
  }


  submitForm() {
    if (this.recommendationForm.valid) {
      const recommendationData = {
        type: this.recommendationForm.value.type,
        description: this.recommendationForm.value.description,
        statut: this.recommendationForm.value.statut
      };

      this.authService.addRecommendation(this.patientId, recommendationData).subscribe({
        next:()=>{
           this.snackBar.open('Recommendation added successfully!', 'Close', { duration: 3000 });
          //  this.router.navigate([`/dashboard/patients/recommendations/${this.patientId}`]);

          // this.router.navigate(['/dashboard/patients/recommendations']);
          this.dialogRef.close(); 
               
        },
        error: err => {
            console.error('Error adding recommendation:', err);
          this.snackBar.open('Failed to add recommendation', 'Close', { duration: 3000 });
        }
      }        
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  // Fermer le modal sans soumettre
  close(): void {
    this.dialogRef.close();
  }
}
