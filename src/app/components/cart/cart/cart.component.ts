import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Cart } from '../../../core/interfaces/cart.interface';
import { CartService } from '../../../core/services/cart/cart.service';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { Products } from '../../../core/interfaces/products.interface';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, CurrencyPipe, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public cartItems: Cart[] = [];

  constructor(private cartService: CartService, private orderService:OrdersService) {}

  ngOnInit(){
    this.loadCartProducts();
  }

  public loadCartProducts(){
    this.cartItems = this.cartService.getCartProducts();
  }

  public placeOrder(){
    const user: User = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if(user){
      console.log(this.cartItems.length);
      for(let i=0; i<this.cartItems.length; i++){
        this.orderService.createNewOrder(user.id, user.name, this.cartItems[i]);
      }
      this.cartService.clearCart();
      this.loadCartProducts();
      alert('Order Placed Successfully.');
    }
    else {
      alert('User not logged In. Please Log in.');
    }
  }

  public clearCart(){
    this.cartService.clearCart();
    this.loadCartProducts();
  }

  public removeFromCart(product: Products){
    this.cartService.removeProductFromCart(product);
    this.loadCartProducts();
  }
}
