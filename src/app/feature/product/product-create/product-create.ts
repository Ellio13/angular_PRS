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

    // build DTO (numeric vendorId)
    const dto = {
      name:       this.newProduct.name,
      vendorId:   this.newProduct.vendorId,             // numeric value from dropdown
      partNumber: this.newProduct.partNumber,
      price:      this.newProduct.price,
      unit:       this.newProduct.unit,
      photoPath:  this.newProduct.photoPath
    };

    console.log('Submitting new product:', dto);

    this.subscription = this.productSvc.add(dto as any).subscribe({
      next: () => this.router.navigateByUrl('/product-list'),
      error: err => console.log('Error adding product', err)
    });
  }
}
