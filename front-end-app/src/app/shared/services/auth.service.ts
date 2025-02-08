import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  baseUrl = 'http://localhost:5059';
  private token: string | null = localStorage.getItem('jwtToken');

  getToken(): string | null {
    return localStorage.getItem('token'); 
  }
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  createUser(formData:any){
    return this.http.post(this.baseUrl+'/api/Auth/register', formData)
  }

  signin(formData:any){
    return this.http.post(this.baseUrl+'/api/Auth/login', formData)
  }

  
  updatePatient(id: number, patientData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/api/Patient/${id}`, patientData, { headers });
  }

  
 
  getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

   // Méthode pour ajouter un patient
   addPatient(patientData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/api/Patient`, patientData, { headers });
  }

   // Exemple de méthode pour récupérer des données sécurisées
   getPatientData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/api/Patient`, { headers });
  }

  getPatientById(id:number):Observable<any>{
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/api/Patient/${id}`, { headers });
  }

  deletePatient(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/api/Patient/${id}`, { headers });
  }

  getRecommandationsByPatientId(patientId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/api/recommendations/patients/${patientId}`, { headers });
  }

  
  addRecommendation(patientId: number, recommendation: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/api/recommendations/patients/${patientId}`, recommendation, { headers });
  }
  
  
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  
}
