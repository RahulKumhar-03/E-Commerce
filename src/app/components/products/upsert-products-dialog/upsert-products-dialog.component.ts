import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Products } from '../../../core/interfaces/products.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsCategory } from '../../../core/interfaces/products-category.interface';
import { MatSelectModule } from '@angular/material/select'
import { ProductService } from '../../../core/services/products/product.service';

@Component({
  selector: 'app-upsert-products-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './upsert-products-dialog.component.html',
  styleUrl: './upsert-products-dialog.component.scss'
})
export class UpsertProductsDialogComponent implements OnInit {
  
  public categories: ProductsCategory[] = [];
  id = signal(0);
  public productForm: FormGroup;
  public service = inject(ProductService);

  constructor(private dialogRef: MatDialogRef<UpsertProductsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Products, private fb: FormBuilder){
    this.productForm = this.fb.group({
      id: [this.id() + 1, Validators.required],
      name: ['', Validators.required],
      categoryId:[0, Validators.required],
      description: ['', Validators.required],
      price: [500, Validators.required],
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
        price: this.data.price
      })
    }
  }
  
  public submitProductForm(){
    if(this.productForm.valid){
      console.log(this.id());
      
      const newProductData = {
        id: this.id() + 1,
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        categoryId: this.productForm.value.categoryId,
        productsImages: [],
        review: [],
      } as Products;

      if(this.service.isEditting() && this.data.id){
        const updatedProductData = {
          id: this.id(),
          name: this.productForm.value.name,
          description: this.productForm.value.description,
          price: this.productForm.value.price,
          categoryId: this.data.categoryId,
          productsImages: [],
          review: [],
        } as Products
        this.dialogRef.close(updatedProductData);
      }

      else {
        this.dialogRef.close(newProductData);
      }

    }
  }

  public onClose(){
    this.dialogRef.close();
  }
}
