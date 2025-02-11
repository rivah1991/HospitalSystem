import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './profil-modal.component.html',
  styleUrls: ['./profil.component.css']
})

export class ProfileModalComponent implements OnInit {
  currentUser: any = {};  
  email: string = ''; 
  specialty: string = '';
  qualification: string = '';
  experience: string = '';
  licenseNumber: string = '';
  emergencyContact: string = '';

  constructor(
    public dialogRef: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        // Initialisation des données utilisateur
        this.specialty = this.currentUser?.specialty || '';
        this.qualification = this.currentUser?.qualification || '';
        this.experience = this.currentUser?.experience || '';
        this.licenseNumber = this.currentUser?.licenseNumber || '';
        this.emergencyContact = this.currentUser?.emergencyContact || '';
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    });
  }
  
  close(): void {
    this.dialogRef.close();
  }

  updateProfile() {
    const updatedData = {
      userId: this.currentUser?.userId,
      specialty: this.specialty,
      qualification: this.qualification,
      email: this.email
    };
  
    this.userService.updateProfile(updatedData).subscribe(
      response => {
        console.log('Profile updated successfully');
      },
      error => {
        console.error('Error updating profile', error);
      }
    );
  }
  
  

  submitProfileUpdate(): void {
    const updatedUser = {
      userId: this.currentUser?.id,  // userId au lieu de UserId
      specialty: this.specialty,
      qualification: this.qualification
    };

    console.log('User data to update:', updatedUser);

    this.userService.updateProfile(updatedUser).subscribe({
      next: (response) => {
        console.log('Profil mis à jour avec succès');
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil', error);
      }
    });
  }
}
