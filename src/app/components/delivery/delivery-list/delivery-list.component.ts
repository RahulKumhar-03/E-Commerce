import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeliveryLocation } from '../../../core/interfaces/delivery-location.interface';
import { DeliveryService } from '../../../core/services/delivery/delivery.service';
import { UpsertDeliveryDialogComponent } from '../upsert-delivery-dialog/upsert-delivery-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delivery-list',
  imports: [MatTableModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss'
})
export class DeliveryListComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<DeliveryLocation>();
  public deliveryLocations: DeliveryLocation[] = [];
  public displayedColumns: string[] = ['city', 'state', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private deliveryService: DeliveryService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.loadDeliveryLocations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public loadDeliveryLocations(){
    this.deliveryLocations = this.deliveryService.getAllDeliveryLocation();
    this.dataSource.data = this.deliveryLocations;
  }

  public openDeliveryDialog(deliveryLocation?: DeliveryLocation){
    let dialogRef = this.dialog.open(UpsertDeliveryDialogComponent,{
      width: '600px',
      data: deliveryLocation
    })

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        if(data && this.deliveryService.isEditing()){
          if(this.deliveryService.updateDeliveryLocation(data)){
            this.snackBar.open('Delivery Location Updated Successfully','Undo',{ duration: 3000 });
            this.loadDeliveryLocations();
          } else {
            this.snackBar.open('Delivery Location Already Exists!!','Undo',{ duration: 3000 });
          }
        }
        else {
          if(this.deliveryService.createDeliveryLocation(data)){
            this.snackBar.open('Delivery Location Created Successfully.','Undo',{ duration: 3000 });
            this.loadDeliveryLocations();
          } else {
            this.snackBar.open('Delivery Location already exists.','Undo',{ duration: 3000 });
          }
        }
      }
    })
  }

  public deleteDeliveryLocation(deliveryLocationId: number){
    this.deliveryService.deleteDeliveryLocation(deliveryLocationId)
    this.snackBar.open('Delivery Location Deleted Successfully.','Undo',{ duration: 3000 });
    this.loadDeliveryLocations();
  }
}
