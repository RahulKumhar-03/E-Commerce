import { Injectable } from '@angular/core';
import { Inventory } from '../../interfaces/inventory.interface';
import { Products } from '../../interfaces/products.interface';
import { ProductsCategory } from '../../interfaces/products-category.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  public inventory!: Inventory;

  constructor() { 
    this.inventory = this.loadInventory();
   }

  public loadInventory(): Inventory {
    const inventory = localStorage.getItem('inventory');
    if (inventory) {
      return JSON.parse(inventory);
    }

    const initialInventory: Inventory = { category: [] };
    localStorage.setItem('inventory', JSON.stringify(initialInventory));

    if (!localStorage.getItem('lastCategoryId')) {
      localStorage.setItem('lastCategoryId', '0'); 
    }
    return initialInventory;
  }

  public getNextCategoryId(): number {
    let lastId = parseInt(localStorage.getItem('lastCategoryId') || '0', 10);
    lastId++;
    localStorage.setItem('lastCategoryId', lastId.toString());
    return lastId;
  }

  public addCategory(name: string): void {
    const newCategory: ProductsCategory = {
      categoryId: this.getNextCategoryId(),
      categoryName: name,
      products: []
    };
    this.inventory.category.push(newCategory);
    this.saveInventoryData();
  }

  public deleteCategory(id: number): void {
    this.inventory.category = this.inventory.category.filter(c => c.categoryId !== id);
    this.saveInventoryData();
  }

  public saveInventoryData(){
    localStorage.setItem('inventory', JSON.stringify(this.inventory))
  }

  public getInventory(): Inventory{
    return this.inventory;
  }

  public addProductToCategory(categoryId: number, product: Products): void {
    const category = this.inventory.category.find(c => c.categoryId === categoryId);
    if (category) {
      const productExists = category.products.find(p => p.id === product.id);
      if(productExists){
        productExists.quantity += product.quantity;
        this.saveInventoryData();
        return;
      }

      category.products.push(product);
      this.saveInventoryData();
    }
  }

  public deleteProductFromCategory(categoryId: number, productId: number){
    const category = this.inventory.category.find(c => c.categoryId === categoryId);
    console.log('Category: ',category + ' ' + 'ProductID: ',productId);
    
    if(category?.products){
      category.products = category.products.filter(product => product.id !== productId);
      console.log('after filtering product',category);
      
      this.saveInventoryData();
      return;
    }
  }

  public  decreaseStock(categoryId: number, productId: number): void {
    const category = this.inventory.category.find(c => c.categoryId === categoryId);
    const product = category?.products.find(p => p.id === productId);
    
    if (product && product.quantity > 0) {
      product.quantity -= 1;
      this.saveInventoryData();
    }
  }

  public increaseStock(categoryId: number, productId: number){
    const category = this.inventory.category?.find(c => c.categoryId === categoryId);
    const product = category?.products.find(p => p.id === productId);
    if(product && product.quantity > 0){
      product.quantity += 1;
      this.saveInventoryData();
    }

  }
}
