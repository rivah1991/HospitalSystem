import { Component, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [MatCardModule,MatTableModule,MatPaginator],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {

  recommendations = [
    { Id: 1, doctorName: 'Bernardo James', designation: 'Initial check-up', role: 'Admin' },
    { Id: 2, doctorName: 'Ronaldo Sullivan', designation: 'Post-surgery visit', role: 'Professional' },
    { Id: 3, doctorName: 'Andrea Lalema', designation: 'Acute pain', role: 'Professional' },
    { Id: 4, doctorName: 'Bernardo James', designation: 'Initial check-up', role: 'Admin' },
    { Id: 5, doctorName: 'Ronaldo Sullivan', designation: 'Post-surgery visit', role: 'Professional' },
    { Id: 6, doctorName: 'Andrea Lalema', designation: 'Acute pain', role: 'Professional' }
  ];
  
  dataSource = new MatTableDataSource(this.recommendations);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;

      // Définir les colonnes à afficher dans le tableau
displayedColumns: string[] = ['Id', 'doctorName', 'designation', 'role'];

ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
