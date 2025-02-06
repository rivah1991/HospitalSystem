import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  baseUrl = 'http://localhost:5059';

  createUser(formData:any){
    return this.http.post(this.baseUrl+'/api/Auth/register', formData)
  }

  signin(formData:any){
    return this.http.post(this.baseUrl+'/api/Auth/login', formData)
  }
}
