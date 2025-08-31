import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../core/interfaces/inventory.interface';
import { InventoryService } from '../../../core/services/inventory/inventory.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpsertInventoryDialogComponent } from '../upsert-inventory-dialog/upsert-inventory-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventory',
  imports: [MatDialogModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  public inventory: Inventory['category'] = [];

  constructor(private inventoryService: InventoryService, private dialog: MatDialog){}

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

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.inventoryService.addCategory(data.name);
        this.loadInventory();
      }
    })
  }

  public deleteCategory(categoryId: number){
    this.inventoryService.deleteCategory(categoryId);
    this.loadInventory();
  }
}
