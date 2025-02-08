import { Component, OnInit } from '@angular/core';

import {MatCardModule} from '@angular/material/card'
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';  
import { MatFormFieldModule } from '@angular/material/form-field';   
import { MatSelectModule } from '@angular/material/select';  
import { MatButtonModule } from '@angular/material/button'; 
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCardModule, MatRadioModule,MatFormFieldModule, MatIconModule,
    MatSelectModule,MatButtonModule,FormsModule,CommonModule
  ],
  templateUrl: './detail.component.html',
  // styleUrl: './detail.component.css'
  styleUrls: ['./detail.component.css', '../patients.component.css']
})
export class DetailPatientComponent implements OnInit {

  patient: any = {};

  // patient = {
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   age: 30,
  //   id: '12345',
  //   email: 'johndoe@example.com',
  //   mobileNumber: '123-456-7890',
  //   maritalStatus: 'Married',
  //   occupation: 'Engineer',
  //   bloodGroup: 'O+',
  //   address: '123 Main St',
  //   city: 'Greensboro, NC',
  //   state: 'North Carolina',
  //   postalCode: '27401',
  //   gender: 'male'
  // };

  constructor( 
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  goBack() {
    this.router.navigate(['/dashboard/patients/list']);
  }

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.authService.getPatientById(+id).subscribe({
        next:(data)=>{
          console.log('data', this.patient); 
         this.patient = data    
               
        },
        error: err => {
          console.error("Error retrieving patient data", err) ;
        }
      })
    }
  }

  // Function to handle editing patient profile
  editPatient() {
    // Navigate to patient edit form or toggle edit mode
    console.log('Edit patient profile');
  }

  
}