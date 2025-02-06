import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

export interface EditPatientData {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  treatment: string;  
  mobile: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-edit-patient-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
   
  ],
  templateUrl: './edit-patient-dialog.component.html',
  styleUrl: './edit-patient-dialog.component.css'
})
export class EditPatientDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditPatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditPatientData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data); // Ferme le dialogue et renvoie les données modifiées
  }
}
