import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

export interface Patient {
  id: number;
  name: string;
  lastName:string;
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
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit, AfterViewInit {

  constructor(private router: Router) {}

  displayedColumns: string[] = [
    'id',
    'name',
    'lastName',
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
    { id: 1, name: 'Jean',lastName:'Dupont', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 2, name: 'Tyf ',lastName:'Zibro', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 3, name: 'Paul ',lastName:'Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 4, name: 'Rak ',lastName:'Thiery', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 5, name: 'Louise ', lastName:'Marth',age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 6, name: 'Bernardo ',lastName:'Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 7, name: 'Abgi ',lastName:'Rot', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 8, name: 'Marie ',lastName:'Curie',  age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 9, name: 'Quit ',lastName:'Aviert', age: 29, gender: 'Female', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 10, name: 'Rak ',lastName:'Thiery', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
    { id: 11, name: 'Louise ', lastName:'Marth',age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
    { id: 12, name: 'Bernardo ',lastName:'tax', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
    { id: 13, name: 'David ', lastName:'Tahiry',age: 37, gender: 'Male', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    // Initialisation du filtre si nécessaire
    this.dataSource.filterPredicate = (data: Patient, filter: string) => {
     
      return data.name.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue; // Applique le filtre sur la source de données
  }
  deletePatient(id: number): void {
    const index = this.dataSource.data.findIndex(patient => patient.id === id);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);  // Supprimer le patient de la liste
      this.dataSource = new MatTableDataSource(this.dataSource.data); 
    }
  }
  editPatient(id: number) {
    this.router.navigate(['/dashboard/patients/update', id]);  
  }

  viewPatientDetails(id: number) {
    this.router.navigate(['/dashboard/patients/detail', id]);  
    
  }

  recommendPatient(id: number) {
    this.router.navigate(['/dashboard/patients/recommendations', id]);  
    console.log('Affichage des recommandation du patient avec ID:', id);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  
}
