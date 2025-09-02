import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserLogin } from '../../interfaces/user-login.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {
  public _isLoggedIn = signal<boolean>(JSON.parse(localStorage.getItem('isLoggedIn') || 'false'));
  public isLoggedIn = computed(() => this._isLoggedIn());
  public router = inject(Router);

  constructor() { }

  public generateId(): number{
    let allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return allUsers.length + 1;
  }

  public getAllUsers():Observable<User[]>{
    let allUsers = localStorage.getItem('users');
    return of(allUsers ? JSON.parse(allUsers) as User[] : []);
  }

  public logout(){
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    this._isLoggedIn.set(false);
    console.log('in logout function call',this._isLoggedIn());
    
    this.router.navigate(['login'])
  }

  public login(userCredentials: UserLogin):Observable<User>{
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = allUsers.find((user => user.email === userCredentials.email && user.password === userCredentials.password)) as User;
    localStorage.setItem('currentUser',JSON.stringify(user));
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    this._isLoggedIn.set(true);
    console.log('in login function call',this._isLoggedIn());
    return of(user);
  }

  public registerUser(userData: User):Observable<User>{
    let users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    if(users.find(user => user.email === userData.email)){
      return of();
    }

    users.push(userData);
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    this._isLoggedIn.set(true);
    return of(userData);
  }

  public isAuthenticated(){
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
    
  }
}

