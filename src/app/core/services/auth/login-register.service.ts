import { Injectable, signal } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserLogin } from '../../interfaces/user-login.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {
  public isLoggedIn = signal<boolean>(JSON.parse(localStorage.getItem('isLoggedIn') || 'false'));

  constructor(private router: Router) {}

  public generateId(): number{
    let allUsers = this.getAllUsers();
    return allUsers.length + 1;
  }

  public getAllUsers(){
    let allUsers = localStorage.getItem('users');
    return allUsers ? JSON.parse(allUsers) as User[] : [];
  }

  public logout(){
    localStorage.removeItem('currentUser');
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    this.isLoggedIn.set(false);
    this.router.navigate(['login'])
  }

  public login(userCredentials: UserLogin):boolean{
    const allUsers = this.getAllUsers();
    const user = allUsers.find((user => user.email === userCredentials.email && user.password === userCredentials.password)) as User;
    if(user){
      localStorage.setItem('currentUser',JSON.stringify(user));
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  public registerUser(userData: User):boolean{
    let users = this.getAllUsers();
    if(users.find(user => user.email === userData.email)){
      return false;
    }

    users.push(userData);
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    this.isLoggedIn.set(true);
    return true;
  }

  public isAuthenticated(){
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
    
  }
}

