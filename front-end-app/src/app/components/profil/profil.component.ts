import { Component } from '@angular/core';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  profile = {
    email: '',
    firstName: '',
    lastName: '',
    profilePhoto: null
  };

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profile.profilePhoto = file;
    }
  }

  onSubmit(): void {
    console.log('Profile updated:', this.profile);
    // Implémentez la logique pour sauvegarder les modifications
  }

}
