import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [
    MatDialogModule,
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
export class ProfileModalComponent {
  username: string = 'Ravoniaina Rivah';  // Nom d'utilisateur fixe
  email: string = '';  // Email, à remplir si vide
  profilePic: string = '/assets/profil.jpg';  // Image de profil par défaut

  constructor(
    public dialogRef: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Méthode pour changer l'image de profil
  changeProfilePic(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePic = reader.result as string;  // Met à jour l'image de profil
      };
      reader.readAsDataURL(file);
    }
  }

  // Méthode pour fermer le modal
  close(): void {
    this.dialogRef.close();
  }

  // Méthode de mise à jour du profil
  updateProfile(): void {
    // Logique pour mettre à jour le profil (par exemple envoyer les données au backend)
    console.log("Profil mis à jour avec :", this.username, this.email);
  }
}
export class ProfilModalComponent {
  showSuggestions = false; // L'état initial des suggestions est caché

  toggleSuggestions() {
    this.showSuggestions = !this.showSuggestions; // Bascule l'état des suggestions
  }
}
