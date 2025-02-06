import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [MatCardModule,MatTableModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {

  recommendations = [
    { Id: 1, doctorName: 'Bernardo James', designation: 'Initial check-up', statut: 'Admin' },
    { Id: 2, doctorName: 'Ronaldo Sullivan', designation: 'Post-surgery visit', statut: 'Professional' },
    { Id: 3, doctorName: 'Andrea Lalema', designation: 'Acute pain', statut: 'Professional' }
  ];
  
      // Définir les colonnes à afficher dans le tableau
displayedColumns: string[] = ['Id', 'doctorName', 'designation', 'statut'];
}
