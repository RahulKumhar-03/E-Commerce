import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Products } from '../../../core/interfaces/products.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { UpsertProductsDialogComponent } from '../upsert-products-dialog/upsert-products-dialog.component';
import { ProductService } from '../../../core/services/products/product.service';
import{ MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-products-dashboard',
  imports: [MatTableModule, MatDialogModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatSelectModule, RouterLink, RouterLinkActive],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.scss'
})
export class ProductsDashboardComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<Products>();
  public displayedColumns: string[] = ['productId', 'productName', 'description', 'price', 'categoryId', 'action'];
  public sortOption: string = 'None';

  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private productService: ProductService, private snackBar: MatSnackBar){}

  ngOnInit():void{
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort;
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
