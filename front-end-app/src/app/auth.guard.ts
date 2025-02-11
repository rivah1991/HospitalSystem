import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Remplacez par votre clé de token

  if (token) {
    return true; // L'utilisateur est authentifié, autoriser l'accès
  } else {
    router.navigate(['/signin']); // Rediriger vers la page de connexion si aucun token
    return false;
  }
};
