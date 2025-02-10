import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy  } from '@angular/core';
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
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Patient {
  id: number;
  firstName: string;
  lastName:string;
  age: number;
  gender: string;
  bloodGroup: string;
  mobile: string;
  email: string;
  city: string;
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
export class PatientsComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService, 
  
  ) {}

  displayedColumns: string[] = [
    'id',
    'fullName',
    'age',
    'gender',
    'bloodGroup',
    'mobile', 
    'email',
    'city',
    'actions',
  ];

  // dataSource = new MatTableDataSource<Patient>([
  //   { id: 1, firstName: 'Jean',lastName:'Dupont', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
  //   { id: 2, firstName: 'Tyf ',lastName:'Zibro', age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
  //   { id: 3, firstName: 'Paul ',lastName:'Martin', age: 29, gender: 'Male', bloodGroup: 'B+', treatment: 'Diabetes', mobile: '123123123', email: 'paul@example.com', address: '789 Rue C' },
  //   { id: 4, firstName: 'Rak ',lastName:'Thiery', age: 45, gender: 'Male', bloodGroup: 'O+', treatment: 'Cyclospora', mobile: '123456789', email: 'jean@example.com', address: '123 Rue A' },
  //   { id: 5, firstName: 'Louise ', lastName:'Marth',age: 37, gender: 'Female', bloodGroup: 'A-', treatment: 'Thyroid', mobile: '987654321', email: 'marie@example.com', address: '456 Rue B' },
  //  ]);

  dataSource = new MatTableDataSource<Patient>([]);
  private subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ngOnInit() {
  //   // Initialisation du filtre si nécessaire
  //   this.dataSource.filterPredicate = (data: Patient, filter: string) => {
     
  //     return data.firstName.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter);
  //   };
  // }
  ngOnInit(): void {
    this.fetchPatients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  fetchPatients(): void {
    this.subscription = this.authService.getPatientData().subscribe(
      (patients: Patient[]) => {
        this.dataSource.data = patients;
      },
      (error) => {
        console.error("Erreur lors de la récupération des patients :", error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue; // Applique le filtre sur la source de données
  }

  deletePatient(id: number): void {
    this.authService.deletePatient(id).subscribe({
      next: (response) => {
        const index = this.dataSource.data.findIndex(patient => patient.id === id);
        if (index !== -1) {
          this.dataSource.data.splice(index, 1);  // Supprimer le patient de la liste
          this.dataSource = new MatTableDataSource(this.dataSource.data); 
          this.toastr.success('Patient Deleted!', 'Successful');
        }
        console.log("Patient supprimé avec succès", response);

      },
      error: (error) => {
        this.toastr.error('Error Delete patient.', 'Deleting Failed');
      }
    });
  
  }

  
  editPatient(id: number) {
    this.router.navigate(['/dashboard/patients/update', id]);  
  }

  viewPatientDetails(id: number) {
    this.router.navigate(['/dashboard/patients/detail', id]);  
    
  }

  recommendPatient(id: number) {
    this.router.navigate(['/dashboard/patients/recommendations', id]);  
    // console.log('Affichage des recommandation du patient avec ID:', id);
  }
  addPatient() {
    this.router.navigate(['/dashboard/patients/add']);  
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

 

  

  
}
