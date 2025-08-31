import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upsert-inventory-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './upsert-inventory-dialog.component.html',
  styleUrl: './upsert-inventory-dialog.component.scss'
})
export class UpsertInventoryDialogComponent {

  public inventoryForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<UpsertInventoryDialogComponent>, private fb: FormBuilder){
    this.inventoryForm = this.fb.group({
      categoryName: ['', Validators.required],
    })
  }

  public submitInventoryForm(){
    if(this.inventoryForm.valid){
      const newCategory = {
        categoryName: this.inventoryForm.value.categoryName,
      }
      this.dialogRef.close(newCategory);
    }
  }

  public onClose(){
    this.dialogRef.close();
  }
}

