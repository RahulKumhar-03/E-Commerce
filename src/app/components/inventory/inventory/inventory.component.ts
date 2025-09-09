import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../core/interfaces/inventory.interface';
import { InventoryService } from '../../../core/services/inventory/inventory.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpsertInventoryDialogComponent } from '../upsert-inventory-dialog/upsert-inventory-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inventory',
  imports: [MatDialogModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  public inventory: Inventory['category'] = [];

  constructor(private inventoryService: InventoryService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit():void{
    this.loadInventory();
  }

  public loadInventory(){
    this.inventory = this.inventoryService.getInventory().category || [];
  }

  public openInventoryDialog(){
    const dialogRef = this.dialog.open(UpsertInventoryDialogComponent,{
      width:'400px'
    })

    dialogRef.afterClosed().subscribe(data=> {
      if(data){
        if(this.inventoryService.addCategory(data)){
          this.snackBar.open('New Category Created Successfully.','Undo',{
            duration: 3000,
          });
          this.loadInventory();;
        } else {
          this.snackBar.open('Category Already Exists.','Undo',{
            duration: 3000,
          });
        }
      }
    })
  }

  public deleteCategory(categoryId: number){
    this.inventoryService.deleteCategory(categoryId);
    this.snackBar.open('Category Deleted Successfully.','Undo',{
      duration: 3000,
    });
    this.loadInventory();
  }
}
