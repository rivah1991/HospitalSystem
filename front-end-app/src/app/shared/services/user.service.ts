import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:5059';  // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token'); 
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Méthode pour mettre à jour le profil de l'utilisateur
  updateProfile(user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/User/update-profile`, user, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error updating profile:', error);
        return throwError(() => new Error('Failed to update profile.'));
      })
    );
  }
 
  getUserProfiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/User/profiles`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching user profiles:', error);
        return throwError(() => new Error('Failed to fetch user profiles.'));
      })
    );
  }

  getCurrentUser(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/api/User/current-user`, { headers });
  }

  
  getPatientByUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    // Correction de l'URL en utilisant la bonne syntaxe d'interpolation
    return this.http.get(`${this.baseUrl}/api/User/user/${userId}`, { headers });
  }
  

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Utilisation de la clé correcte pour le rôle
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    }
    return null;
  }
  
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    }
    return null;
  }

  assignDoctor(patientId: number, doctorId: string): Observable<any> {
    const assignmentDto = {
      patientId: patientId,  // ✅ Minuscule pour correspondre à l'API
      userId: doctorId       // ✅ Minuscule pour correspondre à l'API
    };

    return this.http.post(`${this.baseUrl}/api/User/assign-doctor`, assignmentDto, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error assigning doctor:', error);
        return throwError(() => new Error(error.error || 'Échec de l’assignation du médecin.'));
      })
    );
}

  

}
