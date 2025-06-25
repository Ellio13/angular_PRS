import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { Product } from '../../../model/product';
import { Request } from '../../../model/request';
import { LineItemService } from '../../../service/line-item-service';
import { ProductService } from '../../../service/product-service';
import { RequestService } from '../../../service/request-service';
import { Router, ActivatedRoute } from '@angular/router';
import { LineItemDTO } from '../../../model/line-item-dto';

@Component({
  selector: 'app-line-item-create',
  standalone: false,
  templateUrl: './line-item-create.html',
  styleUrl: './line-item-create.css'
})
export class LineItemCreate implements OnInit, OnDestroy {
  title: string = 'Create Line Item';
  productSubscription!: Subscription;
  requestSubscription!: Subscription;
  lineItem: LineItem = new LineItem();
  products: Product[] = [];
  requests: Request[] = [];
  requestLocked: boolean = false;

  constructor(
    private lineItemSvc: LineItemService,
    private productSvc: ProductService,
    private requestSvc: RequestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const requestId = this.route.snapshot.params['requestId'];
    if (requestId) {
      this.lineItem.requestId = +requestId;
      this.requestLocked = true;
    }

    this.productSubscription = this.productSvc.list().subscribe({
      next: (resp) => this.products = resp,
      error: (err) => console.log('Error retrieving products', err)
    });

    this.requestSubscription = this.requestSvc.list().subscribe({
      next: (resp) => this.requests = resp,
      error: (err) => console.log('Error retrieving requests', err)
    });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    if (this.requestSubscription) {
      this.requestSubscription.unsubscribe();
    }
  }

  save(): void {
    const dto: LineItemDTO = {
      requestId: this.lineItem.requestId,
      productId: this.lineItem.productId,
      quantity: this.lineItem.quantity
    };

    console.log('Creating line item:', dto);

    this.lineItemSvc.add(dto).subscribe({
      next: (resp) => {
        console.log('Line item created:', resp);
      
        this.router.navigate(['/request-lines', dto.requestId]);
      },
      error: (err) => {
        console.log('Error creating line item', err);
        alert('Error creating line item');
      }
    });
  }
}
