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

  public addCategory(name: string): boolean {
    const categoryExists = this.inventory.category.find(category => category.categoryName.toLowerCase() === name.toLowerCase());
    if(categoryExists){
      return false;
    } else {
      const newCategory: ProductsCategory = {
        categoryId: this.getNextCategoryId(),
        categoryName: name,
        products: []
      };
      this.inventory.category.push(newCategory);
      this.saveInventoryData();
      return true;
    }
  }

  public deleteCategory(id: number): void {
    let allProducts:Products[] = JSON.parse(localStorage.getItem('allProducts') || '[]');
    const productsInCategory = this.inventory.category.find(item => item.categoryId === id)?.products!;

    for(let i=0; i<productsInCategory.length; i++){
      allProducts = allProducts.filter(product => product.id !== productsInCategory[i].id);
    }
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
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
    console.log('inside the inventory service');
    
    if(category?.products){
      category.products = category.products.filter(product => product.id !== productId);
      
      this.saveInventoryData();
      console.log('after deleting product in inventory',this.inventory.category);
      
      return;
    }
  }

  public  decreaseStock(categoryId: number, productId: number): void {
    const category = this.inventory.category.find(c => c.categoryId === categoryId);
    const product = category?.products.find(p => p.id === productId);
    
    if (product && product.quantity >= 0) {
      product.quantity -= 1;
      this.saveInventoryData();
    }
  }

  public increaseStock(categoryId: number, productId: number){
    const category = this.inventory.category?.find(c => c.categoryId === categoryId);
    const product = category?.products.find(p => p.id === productId);
    if(product && product.quantity >= 0){
      product.quantity += 1;
      this.saveInventoryData();
    }
  }

  public updateStock(categoryId: number, productId: number, productQuantity: number){
    const category = this.inventory.category?.find(c => c.categoryId === categoryId);
    if (category) {
      const productExists = category.products.find(p => p.id === productId);
      if(productExists){
        productExists.quantity = productQuantity;
        this.saveInventoryData();
        return;
      }
    }
  }
}