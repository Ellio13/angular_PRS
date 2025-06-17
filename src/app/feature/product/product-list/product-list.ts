import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})

export class ProductList implements OnInit, OnDestroy {
  title: string = 'Product List';
  subscription!: Subscription;
  products: Product[] = [];

  constructor(private productSvc: ProductService) {}

  ngOnInit(): void {
    this.subscription = this.productSvc.list().subscribe({
      next: (resp: Product[]) => {
        this.products = resp;
        console.log("products", this.products);
      },
      error: (err: any) => {
        console.log("Error retrieving product list", err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete(id: number): void {
    this.subscription = this.productSvc.delete(id).subscribe({
      next: () => {
        // Refresh the product list after delete
        this.subscription = this.productSvc.list().subscribe({
          next: (resp: Product[]) => {
            this.products = resp;
          },
          error: (err: any) => {
            console.log("Error refreshing product list", err);
          }
        });
      },
      error: (err: any) => {
        console.log('Error deleting product for id: ' + id);
        alert('Error deleting product for id: ' + id);
      }
    });
  }
}
