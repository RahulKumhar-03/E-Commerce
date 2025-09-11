import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Products } from '../../../core/interfaces/products.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-similar-products',
  imports: [MatCardModule, CurrencyPipe, MatButtonModule, RouterLink],
  templateUrl: './similar-products.component.html',
  styleUrl: './similar-products.component.scss'
})
export class SimilarProductsComponent {
  @Input() otherProductsInCategory: Products[] = [];
  @Input() product: Products | undefined;

  constructor(){}

}
