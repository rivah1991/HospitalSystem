import { Component, OnInit } from '@angular/core';

import {MatCardModule} from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';  
import { MatFormFieldModule } from '@angular/material/form-field';   
import { MatSelectModule } from '@angular/material/select';  
import { MatButtonModule } from '@angular/material/button'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCardModule, MatRadioModule,MatFormFieldModule,
    MatSelectModule,MatButtonModule,FormsModule,CommonModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailPatientComponent implements OnInit {

  // Example patient object (replace with actual data from a service)
  patient = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    id: '12345',
    email: 'johndoe@example.com',
    mobileNumber: '123-456-7890',
    maritalStatus: 'Married',
    occupation: 'Engineer',
    bloodGroup: 'O+',
    address: '123 Main St',
    city: 'Greensboro, NC',
    state: 'North Carolina',
    postalCode: '27401',
    gender: 'male'
  };

  constructor() { }

  ngOnInit(): void {
    // Load patient data here (from service, if necessary)
  }

  // Function to handle editing patient profile
  editPatient() {
    // Navigate to patient edit form or toggle edit mode
    console.log('Edit patient profile');
  }
}