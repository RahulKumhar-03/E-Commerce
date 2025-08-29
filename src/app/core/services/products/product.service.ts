import { Injectable, signal } from '@angular/core';
import { Products } from '../../interfaces/products.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  public isEditting = signal<boolean>(false);

  constructor() { }

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

  public deleteProduct(productId: number):Observable<boolean>{
    let allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    allProducts = allProducts.filter(product => product.id !== productId);
    localStorage.setItem('allProducts',JSON.stringify(allProducts));
    return of(true);
  }
}
