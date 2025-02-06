import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

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
  selector: 'app-patients',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'gender',
    'bloodGroup',
    'treatment',
    'mobile',
    'email',
    'address',
    'actions',
  ];

  dataSource = new MatTableDataSource<Patient>([
    { id: 1, name: 'Jean Dupont', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 2, name: 'Marie Curie', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 3, name: 'Paul Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 4, name: 'Rak Thiery', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 5, name: 'Louise Marth', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 6, name: 'Bernardo Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 1, name: 'Jean Dupont', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 2, name: 'Marie Curie', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 3, name: 'Paul Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 4, name: 'Rak Thiery', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 5, name: 'Louise Marth', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 6, name: 'Bernardo Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 5, name: 'David Tahiry', age: 37, gender: 'Male', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
  ]);

  ngOnInit() {
    // Initialisation du filtre si nécessaire
    this.dataSource.filterPredicate = (data: Patient, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue; // Applique le filtre sur la source de données
  }
}
