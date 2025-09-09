import { Injectable, signal } from '@angular/core';
import { Products } from '../../interfaces/products.interface';
import { InventoryService } from '../inventory/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
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
    let newProductId = this.getLastId() + 1;
    this.setLastProductId(newProductId);
    return newProductId;
  }

  public getAllProducts():Products[]{
    let products = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    return products;
  }

  public createProduct(newProduct: Products):boolean{
    let allProducts = this.getAllProducts();
    let productExists:Products | undefined = allProducts.find(product => product.name.toLowerCase() === newProduct.name.toLowerCase() && product.categoryId === newProduct.categoryId);
    
    if(productExists){
      return false;
    } else {
      allProducts.push(newProduct);
      localStorage.setItem('allProducts',JSON.stringify(allProducts));
      return true;
    }
  }

  public updateProduct(updatedProductData: Products):boolean{
    let allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    let productIndex = allProducts.findIndex(product => product.id === updatedProductData.id);
    if(productIndex !== -1){
      allProducts[productIndex] = updatedProductData;
      localStorage.setItem('allProducts', JSON.stringify(allProducts));
      return true;
    }
    return false;
  }

  public deleteProduct(categoryId:number, productId: number){
    let allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]') as Products[];
    allProducts = allProducts.filter(product => product.id !== productId);
    localStorage.setItem('allProducts',JSON.stringify(allProducts));
    this.inventoryService.deleteProductFromCategory(categoryId, productId);
  }
}
