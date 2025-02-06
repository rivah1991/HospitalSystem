import { Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatSlideToggleModule, MatTableModule, FormsModule, CommonModule,
    MatPaginatorModule, MatSortModule
  ],  
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['name', 'approval', 'role'];  // Colonnes à afficher : nom, approbation et rôle

  // Exemple d'utilisateurs avec un statut d'attente d'approbation
  users = [
    { id: 1, name: 'User 1', approved: false, role: 'admin' },
    { id: 2, name: 'User 2', approved: false, role: 'professionnal' },
    { id: 3, name: 'User 3', approved: false, role: 'professionnal' },
    { id: 4, name: 'User 4', approved: true, role: 'admin' },
    { id: 5, name: 'User 5', approved: false, role: 'professionnal' },
    { id: 6, name: 'User 6', approved: true, role: 'admin' },
    { id: 7, name: 'User 7', approved: true, role: 'professionnal' },
    { id: 8, name: 'User 8', approved: false, role: 'admin' },
    { id: 9, name: 'User 9', approved: false, role: 'professionnal' },
    { id: 10, name: 'User 10', approved: true, role: 'admin' }
  ];

  dataSource = new MatTableDataSource(this.users);

  constructor() {}

  ngOnInit(): void {}

  // Méthodes pour changer l'approbation et le rôle
  toggleApproval(user: any): void {
    user.approved = !user.approved;
  }

  toggleRole(user: any): void {
    user.role = user.role === 'professionnal' ? 'admin' : 'professionnal';
  }
}
