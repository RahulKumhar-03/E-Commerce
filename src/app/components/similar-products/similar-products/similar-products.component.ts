import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Products } from '../../../core/interfaces/products.interface';
import { ProductsCategory } from '../../../core/interfaces/products-category.interface';

@Component({
  selector: 'app-similar-products',
  imports: [MatCardModule, CurrencyPipe, RouterLink],
  templateUrl: './similar-products.component.html',
  styleUrl: './similar-products.component.scss'
})
export class SimilarProductsComponent implements OnInit {
  public otherProductsInCategory: Products[] = [];
  @Input() product!: Products;
  constructor(){}

  ngOnInit(): void {
    this.loadOtherProductsInCategory();
  }

  public loadOtherProductsInCategory(){
    const allCategories: ProductsCategory[] = JSON.parse(
          localStorage.getItem('inventory') || ''
        ).category;
        const productsInCategory: Products[] | undefined = allCategories.find(
          (c) => c.categoryId === this.product?.categoryId
        )?.products;
        this.otherProductsInCategory =
          productsInCategory?.filter(
            (product) => product.id !== this.product?.id
          ) || [];
  }
}
