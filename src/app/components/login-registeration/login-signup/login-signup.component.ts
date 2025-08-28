import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {
  public loginForm: FormGroup;
  public signUpForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]]
    })

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      address: ['',Validators.required],
      email:['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword:['',[Validators.required, Validators.minLength(8)]]
    })
  }
}
