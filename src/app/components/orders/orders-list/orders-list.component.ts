import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Orders } from '../../../core/interfaces/orders.interface';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-orders-list',
  imports: [MatTableModule, MatPaginatorModule, DatePipe, CurrencyPipe, MatListModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss'
})
export class OrdersListComponent implements OnInit, AfterViewInit {
  public orders: Orders[] = [];
  public dataSource = new MatTableDataSource<Orders>();
  public displayedColumns: string[] = ['orderId', 'userName', 'productsOrdered', 'totalPrice', 'orderDate'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrdersService){}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public loadOrders(){
    this.dataSource.data = this.orderService.getOrders();
    this.orders = this.orderService.getOrders();
  }

}
