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
    },
    {
        path:'productById', loadComponent: () => import('./components/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path:'goToCart', loadComponent: () => import('./components/cart/cart/cart.component').then(m => m.CartComponent),canActivate:[authGuard]
    },
    {
        path:'inventory', loadComponent: () => import('./components/inventory/inventory/inventory.component').then(m => m.InventoryComponent),canActivate:[authGuard]
    },
    {
        path:'orders', loadComponent: () => import('./components/orders/orders-list/orders-list.component').then(m => m.OrdersListComponent),canActivate:[authGuard]
    },
];
