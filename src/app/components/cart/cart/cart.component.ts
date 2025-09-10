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


@Component({
  selector: 'app-cart',
  imports: [MatCardModule, CurrencyPipe, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public cartItems: Cart[] = [];
  public categories: ProductsCategory[] = [];
  public isProductDeliverable: boolean = false;
  public selectedDeliveryLocationId: number = 0;
  public deliveryLocations: DeliveryLocation[] = [];
  public productToDeliveryLocationMappings: ProductDeliveryLocationMapTable[] = [];

  constructor(private cartService: CartService, private orderService:OrdersService) {}

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

  public getTotalPriceAfterGST(productCategoryId: number, cartItemQuantity: number, productPrice: number){
    // let gst = this.categories.find(category => category.categoryId === )
  }

  public selectDeliveryLocation(){
    if(this.selectedDeliveryLocationId !== 0){
      this.cartItems.forEach(item => {
        let isMappingExists = this.productToDeliveryLocationMappings.find(mapping => 
          mapping.productId === item.product.id && mapping.deliveryLocationId === this.selectedDeliveryLocationId
        )
        if(isMappingExists){
          this.isProductDeliverable = !this.isProductDeliverable;
          console.log(`Product ${item.product.name} is deliverable`);
        } else {
          this.isProductDeliverable = !this.isProductDeliverable;
          console.log(`Product ${item.product.name} is not deliverable`);
        }
        // this.productToDeliveryLocationMappings.forEach(mapping => {
        //   console.log(`Mapping Product Id: ${mapping.productId}`);
        //   console.log(`cart Product Id: ${item.product.id}`);
        //   if(mapping.deliveryLocationId === this.selectedDeliveryLocationId && item.product.id === mapping.productId){
        //     console.log(`Mapping dilvery Id: ${mapping.deliveryLocationId}`);
        //     console.log(`Selected dilvery Id: ${this.selectedDeliveryLocationId}`);
        //     console.log(`Product ${item.product.name} is deliverable`);
        //   } else {
        //     console.log(`Product ${item.product.name} is not deliverable`);
        //   }
        // })
      })
    }
  }

  public placeOrder(){
    const user: User = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if(user){

      for(let i=0; i<this.cartItems.length; i++){
        const gst = this.categories.find(category => category.categoryId === this.cartItems[i].product.categoryId)?.gst!;
        this.orderService.createNewOrder(user.id, user.name, this.cartItems[i], gst);
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
