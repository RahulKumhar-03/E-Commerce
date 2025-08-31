import { Injectable } from '@angular/core';
import { Orders } from '../../interfaces/orders.interface';
import { Products } from '../../interfaces/products.interface';
import { Cart } from '../../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public orders: Orders[] = [];

  constructor() {
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
    const newOrder: Orders = {
      orderId: this.orders.length + 1,
      userId,
      username,
      items: cartItems,
      totalPrice: cartItems.reduce((sum, item) => sum + item.product.price * (item.quantity || 1), 0),
      date: new Date(),
    };

    this.orders.push(newOrder);
    this.saveOrders();
  }

  public getOrders(): Orders[] {
    return this.orders;
  }
}
