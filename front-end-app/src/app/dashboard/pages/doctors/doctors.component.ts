import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';

export interface HealthCare {
  id: string;
  userName: string;
  email: string;
  specialty: string;
  qualification: string;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatPaginator],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<HealthCare>([]);
  private subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Colonnes affichées dans le tableau
  displayedColumns: string[] = ['id',  'email', 'specialty', 'qualification'];

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchHeathCare();
  }

  fetchHeathCare(): void {
    this.subscription = this.userService.getUserProfiles().subscribe(
      (healthCare: HealthCare[]) => {
        this.dataSource.data = healthCare;
        console.log('Données récupérées:', healthCare);
      },
      (error) => {
        console.error("Erreur lors de la récupération des médecins :", error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
