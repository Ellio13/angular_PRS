import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Product } from '../../../model/product';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor-service';
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
  private subscription!: Subscription;
  product!: Product;
  productId!: number;
  vendors: Vendor[] = [];

  constructor(
    private productSvc: ProductService,
    private vendorSvc: VendorService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.subscription = new Subscription();
  }

  //this is the most complicated block of code in the app!  Copilot helped
  //with this structure and the nested subscriptions }}}}}}}}!
  ngOnInit(): void {
    // load vendor
    this.vendorSvc.list().subscribe({
      next: (vs) => {
        this.vendors = vs;
        
       //load product
        this.actRoute.params.subscribe({
          next: (params) => {
            this.productId = params['id'];
            this.productSvc.getById(this.productId).subscribe({
              next: (resp) => {
                this.product = resp;
                console.log('Product loaded:', this.product);
              },
              error: (err) => {
                console.error("Error retrieving product for id: " + this.productId, err);
                alert('Failed to load product. Please try again.');
              }
            });
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  save(): void {
    if (!this.product) {
      alert('Product data not loaded');
      return;
    }

    // Ensure we have a vendorId selected
    if (!this.product.vendorId) {
      alert('Please select a vendor');
      return;
    }

    // Create a DTO with only the fields we need to send to the backend
    const productDto = {
      id: this.product.id,
      name: this.product.name,
      partNumber: this.product.partNumber,
      price: this.product.price,
      unit: this.product.unit,
      photoPath: this.product.photoPath,
      vendorId: this.product.vendorId
    };

    console.log('Saving product:', productDto);
    this.productSvc.update(productDto).subscribe({
      next: () => {
        console.log('Product saved successfully');
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        console.error('Error saving product:', err);
        alert('Failed to save product. Please try again.');
      }
    });
  }
}
