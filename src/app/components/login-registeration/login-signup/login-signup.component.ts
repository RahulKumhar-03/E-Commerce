import { Component, signal } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginRegisterService } from '../../../core/services/auth/login-register.service';
import { User } from '../../../core/interfaces/user.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs'

@Component({
  selector: 'app-login-signup',
  imports: [ReactiveFormsModule, MatSnackBarModule, RouterModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatTabsModule],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {
  public currentUser: string = 'currentUser';
  public loginForm: FormGroup;
  public signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: LoginRegisterService, private snackBar: MatSnackBar, private router: Router){
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]]
    })

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      address: ['',Validators.required],
      phone: ['', Validators.required],
      email:['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  public submitRegisterForm(){
    if(this.signUpForm.valid){
      const newUser = {
        id: this.authService.generateId(),
        name: this.signUpForm.value.name,
        phone: this.signUpForm.value.phone,
        address: this.signUpForm.value.address,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
        cart: [],
      } as User;
      this.authService.registerUser(newUser).subscribe({
        next:(res) => {
          if(res){
            this.snackBar.open('User Registeration Successfull.','Undo',{ duration: 3000 });
            this.router.navigate(['/all-products'])
          } else {
            this.snackBar.open('User Registeration Failed!!','Undo',{ duration: 3000 });
          }
        }
      })
    }
  }

  public submitLoginForm(){
    if(this.loginForm.valid){
      const loginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }
      this.authService.login(loginCredentials).subscribe({
        next:(res) => {
          if(res){
            this.snackBar.open('Login Successful.','Undo',{ duration: 3000 });
            console.log(this.authService.isLoggedIn());
            
            this.router.navigate(['/all-products'])
          }
        },
        error: (err) => {
          this.snackBar.open('Login Failed!!','Undo',{ duration: 3000 });
          console.error('Error while login: ',err);
        }
      })
    }
  }
}
