import { Injectable } from '@angular/core';
import { Orders } from '../../interfaces/orders.interface';
import { CartService } from '../cart/cart.service';
import { InventoryService } from '../inventory/inventory.service';
import { CartItem } from '../../interfaces/cartItem.interface';
import { Cart } from '../../interfaces/cart.interface';
import { DeliveryLocation } from '../../interfaces/delivery-location.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public deliveryLocations: DeliveryLocation[] = JSON.parse(localStorage.getItem('deliveryLocation') || '[]');
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

  public createNewOrder(userId: number, username: string, cartItem: Cart, gst: number, deliveryLocationId: number): void {
    let deliveryLocation = this.deliveryLocations.find(location => location.id === deliveryLocationId)!;
    const newOrder: Orders = {
      orderId: this.orders.length + 1,
      userId,
      username,
      product: cartItem.product,
      quantity: cartItem.quantity,
      totalPrice: cartItem.product.price * cartItem.quantity + (cartItem.product.price * cartItem.quantity)*gst/100,
      deliveryLocation: deliveryLocation?.city+' '+deliveryLocation.state,
      date: new Date(),
    };
    this.orders.push(newOrder);
    this.cartService.updateQuantityInProducts(cartItem.product.id, -cartItem.quantity);
      for(let i = 1; i<= cartItem.quantity; i++){
        this.inventoryService.decreaseStock(cartItem.product.categoryId, cartItem.product.id);
      }
    this.saveOrders();
  }

  public getOrders(): Orders[] {
    return this.orders;
  }
}
