import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { Vendor }  from '../../../model/vendor';
import { ProductService } from '../../../service/product-service';
import { VendorService }  from '../../../service/vendor-service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
  vendors: Vendor[] = [];                               // dropdown data

  constructor(
    private productSvc: ProductService,
    private vendorSvc:   VendorService,                 //  inject vendor service
    private router: Router
  ) {}

  ngOnInit(): void {
    // load vendors once
    this.vendorSvc.list().subscribe(vs => this.vendors = vs);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cancelProduct() {
    this.router.navigateByUrl('/product-list');
  }

  addProduct(): void {
    console.log('Submitting new product:', this.newProduct);

    // Check if any required field is empty
    if (!this.newProduct.vendorId || 
        !this.newProduct.partNumber || 
        !this.newProduct.name || 
        !this.newProduct.price || 
        !this.newProduct.unit) {
      console.log("Form must have all fields");
      return;
    }

    this.subscription = this.productSvc.add(this.newProduct).subscribe({
      next: () => this.router.navigateByUrl('/product-list'),
      error: err => {
        console.log('Error adding product:', err);
      }
    });
  }
}

