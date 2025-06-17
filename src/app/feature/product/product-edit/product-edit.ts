import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../model/product';
import { ProductService } from '../../../service/product-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  standalone: false,
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEdit implements OnInit, OnDestroy {
  title: string = "Product-Edit";
  subscription!: Subscription;
  product!: Product;
  productId!: number;
user: any;
vendor: any;

  constructor(
    private productSvc: ProductService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actRoute.params.subscribe((parms)=>{
      this.productId = parms['id'];
      this.subscription = this.productSvc.getById(this.productId).subscribe({
      next: (resp) => {
          this.product = resp;
      },
      error: (err) => {
        console.log("Error retrieving product for id: " +this.productId, err);
      }
    });
  })
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save() {
    this.productSvc.update(this.product).subscribe({
      next: (resp) => {
        this.product = resp;
        this.router.navigateByUrl('/product-list');
      },
      error: (err) => {
        console.log('error saving product', err);
      }
    });
  }
}
