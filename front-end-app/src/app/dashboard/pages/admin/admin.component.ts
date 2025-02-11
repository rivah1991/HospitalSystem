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
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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


  constructor(
      private authService: AuthService,
      private toastr: ToastrService,
  ) {}

  pendingUsers: any[] = [];

  displayedColumns: string[] = ['user','name', 'role', 'approval'];  // Colonnes à afficher : nom, approbation et rôle

  users: any[] = [];
  // Exemple d'utilisateurs avec un statut d'attente d'approbation
  // users = [
  //   { id: 1, name: 'User 1', role: 'admin', approved: false },
  //   { id: 2, name: 'User 2', role: 'professional', approved: false },
  //   { id: 3, name: 'User 3', role: 'professional', approved: false },
  // ];
  
  dataSource = new MatTableDataSource(this.users);

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Utilisation du modificateur `!` pour indiquer que cette propriété sera définie plus tard


  ngOnInit(): void {
    this.authService.getPendingUsers().subscribe({
      next: (data) => {
        this.users = data;  
        console.log('data pendinguser', data)
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;  
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs', err);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Méthodes pour changer l'approbation et le rôle
  // toggleApproval(user: any): void {
  //   user.isApproved = !user.isApproved;
  // }

  toggleApproval(user: any): void {
    if (!user.isApproved) {
      this.authService.approveUser(user.id).subscribe({
        next: (response) => {
          console.log('Approval response:', response.message);
          this.toastr.success(response.message, 'Approval Successful');
  
          // Supprimer l'utilisateur approuvé de la liste
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
        },
        error: (error) => {
          console.error('Error approving user:', error);
          this.toastr.error('Failed to approve user.', 'Approval Failed');
        }
      });
    }
  }
  
    

  // toggleRole(user: any): void {
  //   user.role = user.role === 'professional' ? 'admin' : 'professional';
  // }
}
