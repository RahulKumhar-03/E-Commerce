import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Products } from '../../../core/interfaces/products.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { UpsertProductsDialogComponent } from '../upsert-products-dialog/upsert-products-dialog.component';
import { ProductService } from '../../../core/services/products/product.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory/inventory.service';
import { ProductsCategory } from '../../../core/interfaces/products-category.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-dashboard',
  imports: [FormsModule, MatTableModule, MatSlideToggleModule, MatDialogModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatSelectModule, RouterLink, RouterLinkActive, MatInputModule, MatFormFieldModule],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.scss'
})
export class ProductsDashboardComponent implements OnInit, AfterViewInit {
  public categories: ProductsCategory[] = [];
  public isChecked: boolean = true;
  public dataSource = new MatTableDataSource<Products>();
  public products: Products[] = [];
  public searchedTerm: string = '';
  public categoryFilterKey: number = 0;
  public displayedColumns: string[] = ['productId', 'productName', 'description', 'price', 'categoryId', 'quantity', 'action'];

  @ViewChild(MatPaginator) productsPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private productService: ProductService, private snackBar: MatSnackBar, private inventoryService: InventoryService){}

  ngOnInit():void{
    this.loadProducts();
    this.loadCategory();
    // console.log(!this.categoryFilterKey);
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.productsPaginator;
    this.dataSource.sort = this.sort;
  }

  public loadProducts(){
    this.productService.getAllProducts().subscribe({
      next:(res) => {
        if(res){
          this.products = res;
          if(this.isChecked){
            this.dataSource.data = res.filter(item => item.quantity > 0)
          } else{
            this.dataSource.data = res.filter(item => item.quantity === 0);
          }
        }
      }
    })
  }

  public onCategorySelect(){
    
    if(this.categoryFilterKey === 0 && this.isChecked){
      this.loadProducts();
      return;
    }
    if(this.isChecked){
      this.dataSource.data = this.products.filter(item => item.categoryId === this.categoryFilterKey && item.quantity > 0);
    }
    else {
      this.dataSource.data = this.products.filter(item => item.categoryId === this.categoryFilterKey);
    }
  }

  public sliderToggleChange(){
    if(this.isChecked){
      this.dataSource.data = this.products.filter(item => item.quantity > 0);
    }
    else {
      this.dataSource.data = this.products.filter(item => item.quantity === 0);
    }
  }

  public searchResult(event: Event){
    this.searchedTerm = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.searchedTerm.trim().toLowerCase();
  }

  // public applyFilter():Products[]{
    
  //   return this.products.filter(product => {
  //     const matchedCategory =!this.categoryFilterKey || product.categoryId === this.categoryFilterKey ;
      
  //     const matchedSearch = !this.searchedTerm && product.name.toLowerCase().includes(this.searchedTerm.toLowerCase()) || product.description.toLowerCase().includes(this.searchedTerm.toLowerCase());
      
  //     return matchedSearch && matchedCategory
  //   })
  // }

  public loadCategory(){
    this.categories = this.inventoryService.getInventory().category;
  }

  public getCategoryName(categoryId: number):string{
    return this.categories.find(c => c.categoryId === categoryId)?.categoryName || '';
  }

  public getSameCategoryItems(categoryId: number){
    return this.categories.find(c => c.categoryId === categoryId)?.products;
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
                this.loadProducts();
                this.inventoryService.updateStock(data.categoryId, data.id, data.quantity);
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

  public deleteProduct(categoryId:number ,productId: number){
    if(confirm('Are You Sure, you want to delete product?')){
      this.productService.deleteProduct(categoryId, productId).subscribe({
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
