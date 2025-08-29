import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Products } from '../../../core/interfaces/products.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { UpsertProductsDialogComponent } from '../upsert-products-dialog/upsert-products-dialog.component';
import { ProductService } from '../../../core/services/products/product.service';
import{ MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-dashboard',
  imports: [MatTableModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.scss'
})
export class ProductsDashboardComponent implements OnInit {

  public dataSource = new MatTableDataSource<Products>();
  public displayedColumns: string[] = ['productId', 'productName', 'description', 'price', 'categoryId', 'action'];

  constructor(private dialog: MatDialog, private productService: ProductService, private snackBar: MatSnackBar){}

  ngOnInit():void{
    this.loadProducts();
  }

  public loadProducts(){
    this.productService.getAllProducts().subscribe({
      next:(res) => {
        if(res){
          this.dataSource.data = res;
        }
      }
    })
  }

  public openProductDialog(productData?: Products){
    let dialog = this.dialog.open(UpsertProductsDialogComponent, {
      width: '600px',
      data: productData
    })

    dialog.afterClosed().subscribe(data => {
      if(data){
        if(data.id && this.productService.isEditting()){
          this.productService.updateProduct(data).subscribe({
            next: (res) => {
              if(res){
                this.snackBar.open('Product Updated Successfully.','Undo',{ duration: 3000 });
                this.loadProducts();
              } else {
                this.snackBar.open('Failed to Update Product!!','Undo',{ duration: 3000 });
              }
            }
          })
        } else {
          this.productService.createProduct(data).subscribe({
            next: (res) => {
              if(res){
                this.snackBar.open('New Product Added Successfully.','Undo',{ duration: 3000 });
                this.loadProducts();
              }
              else {
                this.snackBar.open('Error while adding new Product!!','Undo',{ duration: 3000 });
              }
            }
          })
        }
      }
    })
  }

  public deleteProduct(productId: number){
    if(confirm('Are You Sure, you want to delete product?')){
      this.productService.deleteProduct(productId).subscribe({
        next: (res) => {
          if(res){
            this.snackBar.open('Product Deleted.','Undo',{ duration: 3000 });
            this.loadProducts();
          }
          else {
            this.snackBar.open('Failed to delete Product!!','Undo',{ duration: 3000 });
          }
        }
      })
    }
  }
}
