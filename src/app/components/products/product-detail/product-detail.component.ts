import { Component, OnInit } from '@angular/core';
import { Products } from '../../../core/interfaces/products.interface';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FirstNamePipe } from "../../../pipes/firstname.pipe";
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule, MatIconModule, FirstNamePipe, RouterLink, MatCardModule, CurrencyPipe, MatBadgeModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  public cartItemCount: number = 0;
  public curentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
  public product!: Products;

  constructor(private router: Router, private cartService: CartService){
    this.product = this.router.getCurrentNavigation()?.extras.state?.['product'];
  }

  ngOnInit(){
    this.updateCartCount();
  }

  public updateCartCount(){
    this.cartItemCount = this.cartService.getCartQuantity();
  }

  public addToCart(){
    if(this.product && this.product.quantity > 0) {
      this.cartService.addProductToCart(this.product);
      this.product.quantity -= 1;
      this.updateCartCount();
    }
  }
}
