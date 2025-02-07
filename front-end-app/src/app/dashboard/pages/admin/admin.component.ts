import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatSlideToggleModule, MatTableModule, FormsModule, CommonModule,
    MatPaginatorModule, MatSortModule, MatCardModule
  ],  
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id','name', 'role', 'approval'];  // Colonnes à afficher : nom, approbation et rôle

  // Exemple d'utilisateurs avec un statut d'attente d'approbation
  users = [
    { id: 1, name: 'User 1', role: 'admin', approved: false },
    { id: 2, name: 'User 2', role: 'professional', approved: false },
    { id: 3, name: 'User 3', role: 'professional', approved: false },
    { id: 4, name: 'User 4', role: 'admin', approved: true },
    { id: 5, name: 'User 5', role: 'professional', approved: false },
    { id: 6, name: 'User 6', role: 'admin', approved: true },
    { id: 7, name: 'User 7', role: 'professional', approved: true },
    { id: 8, name: 'User 8', role: 'admin', approved: false },
    { id: 9, name: 'User 9', role: 'professional', approved: false },
    { id: 10, name: 'User 10', role: 'admin', approved: true }
  ];
  
  dataSource = new MatTableDataSource(this.users);

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Utilisation du modificateur `!` pour indiquer que cette propriété sera définie plus tard

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Méthodes pour changer l'approbation et le rôle
  toggleApproval(user: any): void {
    user.approved = !user.approved;
  }

  // toggleRole(user: any): void {
  //   user.role = user.role === 'professional' ? 'admin' : 'professional';
  // }
}
