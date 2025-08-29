import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    {
        path: 'login', loadComponent:() => import('./components/login-registeration/login-signup/login-signup.component').then(m => m.LoginSignupComponent)
    },
    {
        path:'', redirectTo: 'login', pathMatch:'full'
    },
    {
        path:'all-products', loadComponent: () => import('./components/products/products-dashboard/products-dashboard.component').then(m => m.ProductsDashboardComponent), canActivate:[authGuard]
    }
];
