import { Injectable, signal } from '@angular/core';
import { Products } from '../../interfaces/products.interface';
import { Observable, of } from 'rxjs';
import { InventoryService } from '../inventory/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private lastId = signal(this.getLastId() || 0);
  public isEditting = signal<boolean>(false);

  constructor(private inventoryService: InventoryService) { }

  public getLastId():number{
    const productId = localStorage.getItem('lastProductId');
    return productId ? parseInt(productId, 10) : 0;
  }

  private setLastProductId(id: number){
    localStorage.setItem('lastProductId', id.toString());
  }

  public generateId(): number{
    this.lastId.update(id => id + 1);
    const newProductId = this.lastId();
    this.setLastProductId(newProductId);
    return newProductId;
  }

  public getAllProducts():Observable<Products[]>{
    let products = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    return of(products);
  }

  public createProduct(newProduct: Products):Observable<Products>{
    let allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    allProducts.push(newProduct);
    localStorage.setItem('allProducts',JSON.stringify(allProducts));
    return of(newProduct);
  }

  public updateProduct(updatedProductData: Products):Observable<boolean>{
    let allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    let productIndex = allProducts.findIndex(product => product.id === updatedProductData.id);
    allProducts[productIndex] = updatedProductData;
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
    return of(true);
  }

  public deleteProduct(categoryId:number, productId: number):Observable<boolean>{
    let allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    allProducts = allProducts.filter(product => product.id !== productId);
    localStorage.setItem('allProducts',JSON.stringify(allProducts));
    this.inventoryService.deleteProductFromCategory(categoryId, productId);
    return of(true);
  }
}
