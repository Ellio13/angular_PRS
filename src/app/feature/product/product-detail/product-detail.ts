import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product-service';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit, OnDestroy {
  // Title for the page
  title: string = "Product-Detail";

  // Subscription to handle observable lifecycle
  subscription!: Subscription;

  // ID of the product being viewed
  productId!: number;

  // Product object to hold the details of the product
  product!: Product;

  // User object (if needed for additional functionality)
  user: any;

  constructor(
    private productSvc: ProductService, // Service to interact with product data
    private router: Router, // Router for navigation
    private actRoute: ActivatedRoute // ActivatedRoute to access route parameters
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the product ID
    this.actRoute.params.subscribe((parms) => {
      this.productId = parms['id']; // Extract product ID from route parameters

      // Fetch product details using the product service
      this.subscription = this.productSvc.getById(this.productId).subscribe({
        next: (resp) => {
          this.product = resp; // Assign the fetched product to the local variable
        },
        error: (err) => {
          console.log("Error retrieving product for id: " + this.productId, err); // Log errors if fetching fails
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the observable to prevent memory leaks
    this.subscription.unsubscribe();
  }

  delete() {
    // Delete the product using the product service
    this.productSvc.delete(this.productId).subscribe({
      next: (resp) => {
        // Navigate back to the product list after successful deletion
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        console.log(err); // Log errors if deletion fails
      }
    });
  }
}