import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { Vendor }  from '../../../model/vendor';      // ← add
import { VendorService } from '../../../service/vendor-service'; // ← add
import { ProductService } from '../../../service/product-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  standalone: false,
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEdit implements OnInit, OnDestroy {

  title = 'Product-Edit';
  subscription!: Subscription;
  product!: Product;
  productId!: number;
  //dropdown to prevent errors
  vendors: Vendor[] = [];

  constructor(
    private productSvc: ProductService,
    private vendorSvc:  VendorService,        // ← inject
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    /* 1. load vendors for the dropdown */
    this.vendorSvc.list().subscribe(vs => this.vendors = vs);

    /* 2. load the product being edited */
    this.actRoute.params.subscribe(p => {
      this.productId = +p['id'];
      this.subscription = this.productSvc.getById(this.productId).subscribe({
        next: resp => this.product = resp,
        error: err => console.log('Error retrieving product', err)
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  save(): void {
    const dto = {
      id:         this.product.id,
      name:       this.product.name,
      vendorId:   this.product.vendorId,
      partNumber: this.product.partNumber,
      price:      this.product.price,
      unit:       this.product.unit,
      photoPath:  this.product.photoPath
    };

    this.productSvc.update(dto as any).subscribe({
      next: () => this.router.navigateByUrl('/product-list'),
      error: err => console.log('Error saving product', err)
    });
  }
}
