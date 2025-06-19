import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { Product } from '../../../model/product';
import { Request } from '../../../model/request';
import { LineItemService } from '../../../service/line-item-service';
import { ProductService } from '../../../service/product-service';
import { RequestService } from '../../../service/request-service';
import { Router } from '@angular/router';
import { LineItemDTO } from '../../../model/line-item-dto';

@Component({
  selector: 'app-line-item-create',
  standalone: false,
  templateUrl: './line-item-create.html',
  styleUrl: './line-item-create.css'
})
export class LineItemCreate implements OnInit, OnDestroy {
  title: string = 'Create Line Item';
  subscription!: Subscription;
  lineItem: LineItem = new LineItem();
  products: Product[] = [];
  requests: Request[] = [];

  constructor(
    private lineItemSvc: LineItemService,
    private productSvc: ProductService,
    private requestSvc: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.productSvc.list().subscribe({
      next: (resp) => this.products = resp,
      error: (err) => console.log('Error retrieving products', err)
    });

    this.subscription = this.requestSvc.list().subscribe({
      next: (resp) => this.requests = resp,
      error: (err) => console.log('Error retrieving requests', err)
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  save(): void {
    const dto: LineItemDTO = {
      requestId: this.lineItem.requestId,
      productId: this.lineItem.productId,
      quantity: this.lineItem.quantity
    }

    console.log('Creating line item:', dto);
    
    this.lineItemSvc.add(dto).subscribe({
      next: (resp) => {
        console.log('Line item created:', resp);
        this.router.navigateByUrl('/line-item-list');
      },
      error: (err) => {
        console.log('Error creating line item', err);
        alert('Error creating line item');
      }
    });
  }
}
