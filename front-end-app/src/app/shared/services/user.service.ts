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
}
