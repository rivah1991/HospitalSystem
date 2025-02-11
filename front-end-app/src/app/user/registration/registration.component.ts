import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirstKeyPipe } from '../../shared/pipes/firstkey.pipe';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe, RouterLink],
  templateUrl: './registration.component.html',
  // styleUrl: ['./registration.component.css']
  styleUrls: ['./registration.component.css', './../../app.component.css']
})
export class RegistrationComponent { 

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService
  ){ }
  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }
  
    form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Professional'],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      confirmPassword: [''], 
    }, {validators:this.passwordMatchValidator})

    

    onSubmit(){
      this.isSubmitted = true;
      if(this.form.valid){
        // console.log(this.form.value)
        this.service.createUser(this.form.value).subscribe({
          next:(res:any)=>{
            console.log('API Response', res)
            
              this.form.reset();
              this.isSubmitted = false;
              this.toastr.success('awaiting approval!', 'Registration Successful');

              
          },

          error: err => {
            console.log('Error Response:', err);

          if (err.error && Array.isArray(err.error)) { 
            err.error.forEach((x: any) => {
              switch (x.code) {
                case "DuplicateUserName":
                  this.toastr.error('Username is already taken.', 'Registration Failed');
                  break;

                case "DuplicateEmail":
                  this.toastr.error('Email is already taken.', 'Registration Failed');
                  break;

                default:
                  this.toastr.error('Contact the developer', 'Registration Failed');
                  console.log(x);
                  break;
                }
              });
            } else {
              this.toastr.error('An unexpected error occurred.', 'Registration Failed');
              console.log('error:', err);
            }
          }
        })
      }
    }

    hasDisplayableError(controlName: string):Boolean{
      const control = this.form.get(controlName);
      return Boolean(control?.invalid) &&
      (this.isSubmitted) || Boolean(control?.touched)
    }
 
}
