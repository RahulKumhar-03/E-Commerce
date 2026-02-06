import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Cart } from '../../../core/interfaces/cart.interface';
import { CartService } from '../../../core/services/cart/cart.service';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { Products } from '../../../core/interfaces/products.interface';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../core/interfaces/user.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DeliveryLocation } from '../../../core/interfaces/delivery-location.interface';
import { ProductDeliveryLocationMapTable } from '../../../core/interfaces/product-delivery-location-mapping-table.interface';
import { ProductsCategory } from '../../../core/interfaces/products-category.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  imports: [MatCardModule, CurrencyPipe, MatButtonModule, MatFormFieldModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public cartItems: Cart[] = [];
  public categories: ProductsCategory[] = [];
  public selectedDeliveryLocationId: number = 0;
  public deliveryLocations: DeliveryLocation[] = [];
  public productToDeliveryLocationMappings: ProductDeliveryLocationMapTable[] = [];

  constructor(private cartService: CartService, private orderService:OrdersService, private snackBar: MatSnackBar) {}

  ngOnInit(){
    this.loadCartProducts();
    this.loadDeliveryLocations();
    this.loadProductDeliveryLocationMappings();
    this.loadCategories();
  }

  public loadCategories(){
    this.categories = JSON.parse(localStorage.getItem('inventory') || '[]').category;
  }

  public loadDeliveryLocations(){
    this.deliveryLocations = JSON.parse(localStorage.getItem('deliveryLocation') || '[]');
  }

  public loadCartProducts(){
    this.cartItems = this.cartService.getCartProducts();
  }

  public loadProductDeliveryLocationMappings(){
    this.productToDeliveryLocationMappings = JSON.parse(localStorage.getItem('allMappingsProdToDeliLoc') || '[]');
  }

  public getTotalPriceAfterGST(productCategoryId: number, cartItemQuantity: number, productPrice: number):number{
    let gst = this.categories.find(category => category.categoryId === productCategoryId)?.gst;
    if(gst){
      return (cartItemQuantity*productPrice) + (cartItemQuantity*productPrice)*gst/100;
    } else {
      return (cartItemQuantity*productPrice)
    }
  }

  public selectDeliveryLocation(){

    if(this.selectedDeliveryLocationId !== 0){

      this.cartItems.forEach(item => {
        let isMappingExists = this.productToDeliveryLocationMappings.find(mapping => 
          mapping.productId === item.product.id && mapping.deliveryLocationId === this.selectedDeliveryLocationId
        )
        if(isMappingExists){
          item.product.isDeliverable = true;
        } else {
          item.product.isDeliverable = false;
        }
      })
    } 
  }

  public isAllProductsDeliverable():boolean{
    return this.cartItems.some(item => item.product.isDeliverable !== true)
  }

  public placeOrder(){
    const user: User = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if(user){

      let allProducts:Products[] = JSON.parse(localStorage.getItem('allProducts') || '[]');
      for(let i=0; i<this.cartItems.length; i++){
        const gst = this.categories.find(category => category.categoryId === this.cartItems[i].product.categoryId)?.gst!;
        let productQuantity = allProducts.find(product => product.id === this.cartItems[i].product.id)?.quantity!;
        
        if(productQuantity > 0){
          this.orderService.createNewOrder(user.id, user.name, this.cartItems[i], gst, this.selectedDeliveryLocationId);
        }
        else {
          this.snackBar.open('Product Out of Stock','Undo',{ duration: 3000 });
          return;
        }

      }

      this.cartService.clearCart();
      this.loadCartProducts();
      this.snackBar.open('Order Placed.','Undo',{ duration: 3000 });
    }
    else {
      this.snackBar.open('User Must Logged In!','Undo',{ duration: 3000 });
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
