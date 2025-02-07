import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
export class AddRecommandationsComponent {
  recommendationForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<AddRecommandationsComponent>,
    private router: Router
   
  ) {
    this.recommendationForm = this.fb.group({
      patientId: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      statut: ['Pending', Validators.required]
    });
  }

  submitForm() {
    if (this.recommendationForm.valid) {
      console.log('Recommendation submitted:', this.recommendationForm.value);
      this.snackBar.open('Recommendation added successfully!', 'Close', { duration: 3000 });
      // Rediriger vers la page des recommandations
      this.router.navigate(['/dashboard/patients/recommendations']);

      this.recommendationForm.reset();
      this.dialogRef.close();  // Ferme le modal après la soumission
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  // Fermer le modal sans soumettre
  close(): void {
    this.dialogRef.close();
  }
}
