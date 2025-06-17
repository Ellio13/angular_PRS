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
  title: string = "Product-Detail";
  subscription!: Subscription;
  productId!: number;
  product!: Product;
user: any;

  constructor(
    private productSvc: ProductService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actRoute.params.subscribe((parms) => {
      this.productId = parms['id'];
      this.subscription = this.productSvc.getById(this.productId).subscribe({
        next: (resp) => {
          this.product = resp;
        },
        error: (err) => {
          console.log("Error retrieving product for id: " + this.productId, err);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete() {
    this.productSvc.delete(this.productId).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}

