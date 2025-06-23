import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { Vendor }  from '../../../model/vendor';
import { ProductService } from '../../../service/product-service';
import { VendorService }  from '../../../service/vendor-service';        // ← new
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.html',
  styleUrl: './product-create.css'
})
export class ProductCreate implements OnInit, OnDestroy {

  title = 'Product-Create';
  subscription!: Subscription;

  newProduct: Product = new Product();
  vendors: Vendor[] = [];                               // ← dropdown data

  constructor(
    private productSvc: ProductService,
    private vendorSvc:   VendorService,                 // ← inject vendor service
    private router: Router
  ) {}

  ngOnInit(): void {
    // load vendors once
    this.vendorSvc.list().subscribe(vs => this.vendors = vs);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addProduct(): void {
    console.log('Submitting new product:', this.newProduct);
    
    this.subscription = this.productSvc.add(this.newProduct).subscribe({
      next: () => this.router.navigateByUrl('/product-list'),
      error: err => {
        console.error('Error adding product:', err);
        alert('Failed to add product. Please try again.');
      }
    });
  }
  }

