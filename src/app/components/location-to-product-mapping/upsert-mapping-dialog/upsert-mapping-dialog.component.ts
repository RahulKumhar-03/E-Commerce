import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductDeliveryLocationMapTable } from '../../../core/interfaces/product-delivery-location-mapping-table.interface';
import { ProductDeliveryLocationMappingService } from '../../../core/services/product-delivery-location-mapping/product-delivery-location-mapping.service';
import { Products } from '../../../core/interfaces/products.interface';
import { DeliveryLocation } from '../../../core/interfaces/delivery-location.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upsert-mapping-dialog',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatButtonModule],
  templateUrl: './upsert-mapping-dialog.component.html',
  styleUrl: './upsert-mapping-dialog.component.scss'
})
export class UpsertMappingDialogComponent implements OnInit {
  public isEditing = signal<boolean>(false);
  public mappingForm: FormGroup;
  public mappingService = inject(ProductDeliveryLocationMappingService);
  public allProducts: Products[] = []
  public allDeliveryLocations: DeliveryLocation[] = [];

  constructor(private fb: FormBuilder, private dialogRef:MatDialogRef<UpsertMappingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductDeliveryLocationMapTable){
    this.mappingForm = this.fb.group({
      productId: [null, Validators.required],
      deliveryLocationId: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    if(this.data){
      console.log(this.data);
      
      this.isEditing.set(true);
      this.mappingForm.patchValue({
        productId: this.data.productId,
        deliveryLocationid: this.data.deliveryLocationId,
      })
    }
    this.loadProducts();
    this.loadDeliveryLocation();
  }

  public loadProducts(){
    this.allProducts = JSON.parse(localStorage.getItem('allProducts') || '[]');
  }

  public loadDeliveryLocation(){
    this.allDeliveryLocations = JSON.parse(localStorage.getItem('deliveryLocation') || '[]');
  }

  public submitMappingForm(){
    if(this.mappingForm.valid){
      if(this.data?.id && this.mappingService.isEditing()){
        const updatedMappingData:ProductDeliveryLocationMapTable = {
          id: this.data.id,
          productId: this.mappingForm.value.productId,
          deliveryLocationId: this.mappingForm.value.deliveryLocationId
        }
        this.dialogRef.close(updatedMappingData);
      } else {
        const newMappingData: ProductDeliveryLocationMapTable = {
          id: this.mappingService.generateId(),
          productId: this.mappingForm.value.productId,
          deliveryLocationId: this.mappingForm.value.deliveryLocationId
        }
        console.log(newMappingData)
        this.dialogRef.close(newMappingData);
      }
    }
  }

  public onDialogClose(){
    this.dialogRef.close();
  }
}
