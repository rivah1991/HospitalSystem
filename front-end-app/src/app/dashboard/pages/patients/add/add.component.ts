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

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    MatCardModule, MatFormFieldModule, MatRadioModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatSidenavModule, MatToolbarModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddPatientComponent {

}
