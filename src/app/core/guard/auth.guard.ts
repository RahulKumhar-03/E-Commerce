import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginRegisterService } from '../services/auth/login-register.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginRegisterService);
  const router = inject(Router);

  if(loginService.isLoggedIn()){
    return true;
  }
  else {
    router.navigate(['/login']);
    return false;
  }
};
