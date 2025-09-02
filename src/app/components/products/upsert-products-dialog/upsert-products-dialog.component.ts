import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Products } from '../../../core/interfaces/products.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsCategory } from '../../../core/interfaces/products-category.interface';
import { MatSelectModule } from '@angular/material/select'
import { ProductService } from '../../../core/services/products/product.service';
import { InventoryService } from '../../../core/services/inventory/inventory.service';

@Component({
  selector: 'app-upsert-products-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './upsert-products-dialog.component.html',
  styleUrl: './upsert-products-dialog.component.scss'
})
export class UpsertProductsDialogComponent implements OnInit {
  
  public categories: ProductsCategory[] = [];
  public imageUrl: string = ''; 
  public productForm: FormGroup;
  public service = inject(ProductService);

  constructor(private dialogRef: MatDialogRef<UpsertProductsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Products, private fb: FormBuilder, private inventoryService: InventoryService){
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId:[null, Validators.required],
      description: ['', Validators.required],
      price: [500, Validators.required],
      productImages: ['', Validators.required],
      quantity: [1, Validators.required],
    });
  }

  ngOnInit():void{
    if(this.data){
      this.service.isEditting.set(true);
      this.productForm.patchValue({
        id: this.data.id,
        name: this.data.name,
        description: this.data.description,
        categoryId: this.data.categoryId,
        price: this.data.price,
        productImages: this.data.productsImages,
        quantity: this.data.quantity,
      })
    }
    this.loadCategories();
  }

  public loadCategories(){
    this.categories = this.inventoryService.getInventory().category || [];
  }
  
  public submitProductForm(){
    if(this.productForm.valid){

      if(this.service.isEditting() && this.data.id){
        const updatedProductData: Products = {
          id: this.data.id,
          name: this.productForm.value.name,
          description: this.productForm.value.description,
          price: this.productForm.value.price,
          categoryId: this.data.categoryId,
          productsImages: this.productForm.value.productImages,
          review: [],
          quantity: this.productForm.value.quantity,
        };
        this.inventoryService.addProductToCategory(updatedProductData.categoryId, updatedProductData);
        this.dialogRef.close(updatedProductData);
      }

      else {
        const newProductData: Products = {
        id: this.service.generateId(),
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        categoryId: this.productForm.value.categoryId,
        productsImages: this.productForm.value.productImages,
        review: [],
        quantity: this.productForm.value.quantity,
      };
        this.inventoryService.addProductToCategory(newProductData.categoryId, newProductData);
        this.dialogRef.close(newProductData);
      }

    }
  }

  public onClose(){
    this.dialogRef.close();
  }
}
