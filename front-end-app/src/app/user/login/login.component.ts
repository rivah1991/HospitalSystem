import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './../../app.component.css']
})
export class LoginComponent {
  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private router:Router,
     private toastr: ToastrService
  ){}
  form = this.formBuilder.group({
    username:['', [Validators.required]],
    password: ['', Validators.required]
  })
  isSubmitted: boolean = false;

  onSubmit(){
    this.isSubmitted = true;
    // console.log(this.form.value)
    if(this.form.valid){
      //  this.router.navigateByUrl('/dashboard') //tahiry

      this.service.signin(this.form.value).subscribe({
        next:(res:any)=>{
          // localStorage.setItem('token', res.token);
          this.service.setToken(res.token);
          this.router.navigateByUrl('/dashboard/patients/list')

        },
        error: (err) => {
          console.log('Error Response:', err);
  
          // Check the HTTP status and display an appropriate message
          if (err.status === 401) {
            this.toastr.error(err.error?.message || 'Invalid credentials', 'Login Error');
          } else {
            this.toastr.error('An error occurred. Please try again.', 'Error');
          }
        }
      })
    }
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

}
