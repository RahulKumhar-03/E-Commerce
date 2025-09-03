import { Component, OnInit } from '@angular/core';
import { Products } from '../../../core/interfaces/products.interface';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FirstNamePipe } from "../../../pipes/firstname.pipe";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { MatBadgeModule } from '@angular/material/badge';
import { ReviewsListComponent } from "../../reviews/reviews-list/reviews-list.component";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule, MatIconModule, FirstNamePipe, RouterLink, MatCardModule, CurrencyPipe, MatBadgeModule, ReviewsListComponent, MatSnackBarModule, RouterLinkActive],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  public cartItemCount: number = 0;
  public otherProductsInCategory: Products[] = [];
  public currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
  public currentImageUrl: string = '';
  public nextImageUrlIndex: number = 0;
  public product!: Products;
  public productCountInCart: number = 0;

  constructor(private router: Router, public cartService: CartService, private snackBar: MatSnackBar){
    this.product = this.router.getCurrentNavigation()?.extras.state?.['product'];
    this.otherProductsInCategory = this.router.getCurrentNavigation()?.extras.state?.['sameCategoryItems'];
    this.otherProductsInCategory = this.otherProductsInCategory.filter(item => item.id !== this.product.id);
  }

  ngOnInit(){
    this.updateCartCount();
    this.updateProductCountInCart();
    this.displayNextImage();
    this.startImageDisplay();
  }

  public updateCartCount(){
    this.cartItemCount = this.cartService.getCartQuantity();
  }

  public updateProductCountInCart(){
    this.productCountInCart = this.cartService.getProductCountInCart(this.product);
  }

  public displayNextImage(){
    this.currentImageUrl = this.product.productsImages[this.nextImageUrlIndex];
    this.nextImageUrlIndex = (this.nextImageUrlIndex + 1) % this.product.productsImages.length;
  }

  public startImageDisplay(){
    setInterval(() => {
      this.displayNextImage();
    },5000);
  }

  public addToCart(){
    if(this.product && this.product.quantity > 0) {
      this.cartService.addProductToCart(this.product);
      this.product.quantity -= 1;
      this.updateCartCount();
      this.updateProductCountInCart();
    }
    else {
      this.snackBar.open('Product Out of Stock','Undo',{ duration: 3000 })
    }
  }

  public removeFromCart(product: Products){
    this.cartService.removeOneProduct(product);
    this.updateCartCount();
    this.updateProductCountInCart();
  }
}
