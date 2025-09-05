import { Injectable } from '@angular/core';
import { Orders } from '../../interfaces/orders.interface';
import { Products } from '../../interfaces/products.interface';
import { Cart } from '../../interfaces/cart.interface';
import { CartService } from '../cart/cart.service';
import { InventoryService } from '../inventory/inventory.service';
import { CartItem } from '../../interfaces/cartItem.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public orders: Orders[] = [];

  constructor(private cartService: CartService, private inventoryService: InventoryService) {
    this.orders = this.loadOrders();
  }

  public loadOrders():Orders[]{
    const orders = localStorage.getItem('orders');
    if(orders){
      return JSON.parse(orders);
    }
    else {
      localStorage.setItem('orders',JSON.stringify([]));
      return [];
    }
  }

  public saveOrders(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  public createNewOrder(userId: number, username: string, cartItem: CartItem): void {
    console.log(cartItem);
    
    const newOrder: Orders = {
      orderId: this.orders.length + 1,
      userId,
      username,
      product: cartItem.product,
      quantity: cartItem.quantity,
      totalPrice: cartItem.product.price * cartItem.quantity,
      date: new Date(),
    };
    this.orders.push(newOrder);
    this.cartService.updateQuantityInProducts(cartItem.product.id, -cartItem.quantity);
      console.log('in orders service while creating new order: ',cartItem.product);
      for(let i = 1; i<= cartItem.quantity; i++){
        this.inventoryService.decreaseStock(cartItem.product.categoryId, cartItem.product.id);
      }
    this.saveOrders();
  }

  public getOrders(): Orders[] {
    return this.orders;
  }
}
