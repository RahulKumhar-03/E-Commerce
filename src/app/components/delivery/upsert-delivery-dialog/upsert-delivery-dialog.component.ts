import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeliveryLocation } from '../../../core/interfaces/delivery-location.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DeliveryService } from '../../../core/services/delivery/delivery.service';

@Component({
  selector: 'app-upsert-DeliveryLocation-dialog',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './upsert-delivery-dialog.component.html',
  styleUrl: './upsert-delivery-dialog.component.scss'
})
export class UpsertDeliveryDialogComponent implements OnInit {
  public deliveryForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<UpsertDeliveryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DeliveryLocation, private fb: FormBuilder, public deliveryService: DeliveryService){
    this.deliveryForm = this.fb.group({
      city: ['', Validators.required],
      state: ['', Validators.required]
    })
  }
  
  ngOnInit(): void {
    if(this.data){
      this.deliveryService.isEditing.set(true);
      this.deliveryForm.patchValue({
        city: this.data.city,
        state: this.data.state
      })
    }
  }

  public submitDeliveryForm(){
    if(this.deliveryForm.valid){
      if(this.deliveryService.isEditing() && this.data.id){
        const updatedDeliveryData: DeliveryLocation = {
          id: this.data.id,
          city: this.deliveryForm.value.city,
          state: this.deliveryForm.value.state
        }
        this.dialogRef.close(updatedDeliveryData);
      } else {
        const newDeliveryData: DeliveryLocation = {
          id: this.deliveryService.generateId(),
          city: this.deliveryForm.value.city,
          state: this.deliveryForm.value.state
        }
        this.dialogRef.close(newDeliveryData);
      }
    }
  }

  public onDialogClose(){
    this.dialogRef.close();
  }
}
