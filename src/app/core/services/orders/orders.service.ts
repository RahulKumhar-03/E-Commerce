import { Injectable } from '@angular/core';
import { Orders } from '../../interfaces/orders.interface';
import { Products } from '../../interfaces/products.interface';
import { Cart } from '../../interfaces/cart.interface';
import { CartService } from '../cart/cart.service';
import { InventoryService } from '../inventory/inventory.service';

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

  public createNewOrder(userId: number, username: string, cartItems: Cart[]): void {
    console.log(cartItems);
    
    const newOrder: Orders = {
      orderId: this.orders.length + 1,
      userId,
      username,
      items: cartItems,
      totalPrice: cartItems.reduce((sum, item) => sum + item.product.price * (item.quantity), 0),
      date: new Date(),
    };
    this.orders.push(newOrder);
    cartItems.map(item => {
      this.cartService.updateQuantityInProducts(item.product.id, -item.quantity);
      console.log('in orders service while creating new order: ',item.product);
      for(let i = 1; i<= item.quantity; i++){
        this.inventoryService.decreaseStock(item.product.categoryId, item.product.id);
      }
    })
    this.saveOrders();
  }

  public getOrders(): Orders[] {
    return this.orders;
  }
}
