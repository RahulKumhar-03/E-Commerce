import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductDeliveryLocationMapTable } from '../../../core/interfaces/product-delivery-location-mapping-table.interface';
import { MatIconModule } from '@angular/material/icon';
import { ProductDeliveryLocationMappingService } from '../../../core/services/product-delivery-location-mapping/product-delivery-location-mapping.service';
import { Products } from '../../../core/interfaces/products.interface';
import { DeliveryLocation } from '../../../core/interfaces/delivery-location.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpsertMappingDialogComponent } from '../upsert-mapping-dialog/upsert-mapping-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mapping-list',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './mapping-list.component.html',
  styleUrl: './mapping-list.component.scss'
})
export class MappingListComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<ProductDeliveryLocationMapTable>();
  public deliveryLocation: DeliveryLocation[] = [];
  public displayedColumns: string[] = ['productId', 'deliveryLocationId', 'action'];
  public products: Products[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private mappingService: ProductDeliveryLocationMappingService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit():void{
    this.loadMappings();
    this.loadProducts();
    this.loadDeliveryLocation();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public loadMappings(){
    this.dataSource.data = this.mappingService.getAllMappings();
  }

  public loadProducts(){
    this.products = JSON.parse(localStorage.getItem('allProducts') || '[]');
  }

  public loadDeliveryLocation(){
    this.deliveryLocation = JSON.parse(localStorage.getItem('deliveryLocation') || '[]');
  }

  public openMappingDialog(mappingData?: ProductDeliveryLocationMapTable){
    let dialogRef = this.dialog.open(UpsertMappingDialogComponent,{
      width: '600px',
      data: mappingData
    })

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        if(data && this.mappingService.isEditing()){
          if(this.mappingService.updateMapping(data)){
            this.snackBar.open('Successfully Updated Mapping Details.','Undo',{ duration: 3000 });
            this.loadMappings();
          } else {
            this.snackBar.open('Updated Delivery Location mapping already exists.','Undo',{ duration: 3000 });
          }
        } else {
          if(this.mappingService.createMapping(data)){
            this.snackBar.open('Successfully Added New Mapping Details.','Undo',{ duration: 3000 });
            this.loadMappings();
          } else {
            this.snackBar.open('Mapping Already Exists for selected Product and Delivery Location','Undo',{ duration: 3000 });
          }
        }
      }
    })
  }

  public deleteMapping(mappingId: number){
    this.mappingService.deleteMapping(mappingId);
    this.snackBar.open('Successfully Deleted Mapping Details.','Undo',{ duration: 3000 });
    this.loadMappings();
  }

  public getProductName(productId: number):string{
    return this.products.find(product => product?.id === productId)?.name!;
  }

  public getDeliveryLocation(deliveryLocationId: number):string{
    return this.deliveryLocation.find(location => location?.id === deliveryLocationId)?.city!;
  }
}
