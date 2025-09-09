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
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-products-dashboard',
  imports: [FormsModule, MatTableModule, MatSlideToggleModule, MatDialogModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule, MatSelectModule, RouterLink, RouterLinkActive, MatInputModule, MatFormFieldModule, CurrencyPipe],
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

  constructor(private dialog: MatDialog, private productService: ProductService, private snackBar: MatSnackBar, private inventoryService: InventoryService, private cartService: CartService){}

  ngOnInit():void{
    this.loadProducts();
    this.loadCategory();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.productsPaginator;
    this.dataSource.sort = this.sort;
  }

  public loadProducts(){
    this.products = this.productService.getAllProducts()
    this.dataSource.data = this.products;
  }

  public onCategorySelect(){
    this.applyFilter();
  }

  public sliderToggleChange(){
    this.applyFilter();
  }

  public searchResult(){
    this.applyFilter();
  }

  public applyFilter(){
    let filteredProductsArray = this.products;
    if(this.categoryFilterKey !== 0){
      filteredProductsArray = filteredProductsArray.filter(item => item.categoryId === this.categoryFilterKey);
    }
    else{
      this.dataSource.data = filteredProductsArray;
    }

    if(this.isChecked){
      filteredProductsArray = filteredProductsArray.filter(product => product.quantity > 0);
    } else {
      filteredProductsArray = filteredProductsArray.filter(product => product.quantity === 0)
    }

    if(this.searchedTerm){
      filteredProductsArray = filteredProductsArray.filter(product => 
        product.name.toLowerCase().includes(this.searchedTerm.toLowerCase()) || product.description.toLowerCase().includes(this.searchedTerm.toLowerCase())
      )
    }
    this.dataSource.data = filteredProductsArray;
  }

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
          if(this.productService.updateProduct(data)){
            this.snackBar.open('Product Updated Successfully.','Undo',{ duration: 3000 });
            this.loadProducts();
            this.cartService.updateProductInCart(data);
          } else {
            this.snackBar.open('Product Update Failed.','Undo',{ duration: 3000 });
          }
        } else {
          if(this.productService.createProduct(data)){
            this.snackBar.open('New Product Created Successfully.','Undo',{ duration: 3000 });
            this.loadProducts();
          } else {
            this.snackBar.open('Product Already Exists.','Undo',{ duration: 3000 });
          }
        }
      }
    })
  }

  public deleteProduct(categoryId:number ,productId: number){
    this.productService.deleteProduct(categoryId, productId)
    this.snackBar.open('Product Deleted.','Undo',{ duration: 3000 });
    this.loadProducts();
  }
}
