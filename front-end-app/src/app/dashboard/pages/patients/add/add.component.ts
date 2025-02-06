import { Component } from '@angular/core';
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
import { AddRecommandationsComponent } from '../add-recommandations/add-recommandations.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    MatCardModule, MatFormFieldModule, MatRadioModule, MatSelectModule, MatIconModule,
    MatInputModule, MatButtonModule, MatSidenavModule, MatToolbarModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddPatientComponent {

  constructor(public dialog: MatDialog) {}

  openRecommendationModal(): void {
    const dialogRef = this.dialog.open(AddRecommandationsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed');
      // Ajoutez ici des actions après la fermeture du modal
    });
  }

}
