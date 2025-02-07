import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // Pour `mat-select`
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-change-status-modal-component',
  standalone: true,
  imports: [
    MatFormFieldModule,MatSelectModule,MatButtonModule,MatDialogModule

  ],
  templateUrl: './change-status-modal-component.component.html',
  styleUrl: './change-status-modal-component.component.css'
})
export class ChangeStatusModalComponentComponent {
  newStatus: string;
  statuses = ['Completed', 'Pending', 'In Progress']; // Liste des statuts possibles

  constructor(
    public dialogRef: MatDialogRef<ChangeStatusModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.statut) {
      this.newStatus = data.statut; // Assurez-vous que 'statut' est bien défini
    } else {
      this.newStatus = 'Pending'; // Valeur par défaut si data.statut est manquant
    }
  }
  

  onCancel(): void {
    this.dialogRef.close(); // Fermer sans changer
  }

  onSave(): void {
    this.dialogRef.close(this.newStatus); // Fermer et retourner le nouveau statut
  }
}
