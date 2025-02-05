import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';


export interface Patient {
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
  selector: 'app-main-content',
  standalone: true,
  
  imports: [
    
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {
  displayedColumns: string[] = ['id', 'name', 'age', 'gender', 'bloodGroup', 'treatment', 'mobile', 'email', 'address', 'actions'];
  dataSource: Patient[] = [
    { id: 1, name: 'Jean Dupont', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Chirurgie', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 2, name: 'Marie Curie', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Médicament', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 3, name: 'Paul Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Thérapie', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' }
  ];
}
