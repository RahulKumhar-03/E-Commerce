import { Injectable } from '@angular/core';
import { Products } from '../../interfaces/products.interface';
import { User } from '../../interfaces/user.interface';
import { Cart } from '../../interfaces/cart.interface';
import { InventoryService } from '../inventory/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private currentUser: User | null = this.getCurrentUser();

  constructor(private inventoryService: InventoryService) { }

  public getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  public saveCurrentUser(user: User){
    localStorage.setItem('currentUser', JSON.stringify(user));
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.map(u => (u.id === user.id ? user : u));
    localStorage.setItem('users', JSON.stringify(users));
  }

  public updateQuantityInProducts(productId: number, change: number): void {
    let allProducts: Products[] = JSON.parse(localStorage.getItem('allProducts') || '[]');
    allProducts = allProducts.map(p => {
      if (p.id === productId) {
        return { ...p, quantity: p.quantity + change };
      }
      return p;
    });
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
  }

  public addProductToCart(product: Products): void {
    if (!this.currentUser) return;

    const cartProduct = this.currentUser.cart.find(item => item.product.id === product.id);
    if (cartProduct) {
      cartProduct.quantity += 1;
    } else {
      this.currentUser.cart.push({ product, quantity: 1 });
    }

    this.inventoryService.decreaseStock(product.categoryId, product.id);
    this.updateQuantityInProducts(product.id, -1);
    this.saveCurrentUser(this.currentUser);
  }

  public removeProductFromCart(product: Products): void {
    if (!this.currentUser) return;

    const cartProductIndex = this.currentUser.cart.findIndex(item => item.product.id === product.id);
    if (cartProductIndex !== -1) {
      const cartProduct = this.currentUser.cart[cartProductIndex];

      for (let i = 1; i <= cartProduct.quantity; i++) {
        this.inventoryService.increaseStock(cartProduct.product.categoryId, cartProduct.product.id);
        this.updateQuantityInProducts(cartProduct.product.id, +1);
      }

      this.currentUser.cart.splice(cartProductIndex, 1);
    }
    this.saveCurrentUser(this.currentUser);
  }

  clearCart(): void {
    if (!this.currentUser) return;

    this.currentUser.cart.forEach(item => {
      for (let i = 1; i <= item.quantity; i++) {
        this.inventoryService.increaseStock(item.product.categoryId, item.product.id);
        this.updateQuantityInProducts(item.product.id, +1);
      }
    });

    this.currentUser.cart = [];
    this.saveCurrentUser(this.currentUser);
  }

  getCartProducts(): Cart[] {
    return this.currentUser ? this.currentUser.cart : [];
  }

  getCartQuantity(): number {
    return this.getCartProducts()?.reduce((sum, item) => sum + item.quantity, 0);
  }
}
