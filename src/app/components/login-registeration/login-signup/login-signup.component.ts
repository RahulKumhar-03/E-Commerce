import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
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
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]]
    })

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      address: ['',Validators.required],
      phone: ['', Validators.required],
      email:['',[this.emailValidators(), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  public emailValidators():ValidatorFn{
    return (emailControl:AbstractControl):ValidationErrors | null => {
      let emailControlValue = emailControl.value;

      if(emailControlValue){
        const domain:string = emailControlValue.split('@');
        
        if(domain[1]?.toLowerCase() === 'gmail.com' || domain[1]?.toLowerCase() === 'yahoo.com'){
          return null
        }
      }
      return { emailDomain: { requiredDomain: "'gmail.com' or 'yahoo.com'" } };
    }
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
      if(this.authService.registerUser(newUser)){
        this.snackBar.open('User Registeration Successfull.','Undo',{ duration: 3000 });
        this.router.navigate(['/all-products'])
      } else {
        this.snackBar.open('User Registeration Failed!!','Undo',{ duration: 3000 });
      }
    }
  }

  public submitLoginForm(){
    if(this.loginForm.valid){
      const loginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }
      if(this.authService.login(loginCredentials)){
        this.snackBar.open('Login Successful.','Undo',{ duration: 3000 });
        this.router.navigate(['/all-products'])
      } else {
        this.snackBar.open('Login Failed!! Check Credentials & Try Again','Undo',{ duration: 3000 });
      } 
    }
  }
}
