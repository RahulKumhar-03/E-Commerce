import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserLogin } from '../../interfaces/user-login.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {
  public _isLoggedIn = signal<boolean>(false);
  public isLoggedIn = computed(() => this._isLoggedIn());
  public router = inject(Router);

  constructor() { }

  public getAllUsers():Observable<User[]>{
    let data = localStorage.getItem('users');
    return of(data ? JSON.parse(data) as User[] : []);
  }

  public logout(){
    localStorage.removeItem('currentUser');
    this._isLoggedIn.set(false);
    this.router.navigate(['login'])
  }

  public login(userCredentials: UserLogin):Observable<User>{
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = allUsers.find((user => user.email === userCredentials.email && user.password === userCredentials.password)) as User;
    localStorage.setItem('currentUser',JSON.stringify(user));
    this._isLoggedIn.set(true);
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
    this._isLoggedIn.set(true);
    return of(userData);
  }

  public isAuthenticated(){
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
  }

  public userIsPresent(){
    if(JSON.parse(localStorage.getItem('currentUser') || '{}')){
      this._isLoggedIn.set(true);
    }
  }
}

