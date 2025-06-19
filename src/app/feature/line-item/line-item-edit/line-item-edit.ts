import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { LineItemDTO } from '../../../model/line-item-dto';
import { Request } from '../../../model/request';
import { Product } from '../../../model/product';
import { LineItemService } from '../../../service/line-item-service';
import { RequestService } from '../../../service/request-service';
import { ProductService } from '../../../service/product-service';

@Component({
  selector: 'app-line-item-edit',
  standalone: false,
  templateUrl: './line-item-edit.html',
  styleUrl: './line-item-edit.css'
})
export class LineItemEdit implements OnInit, OnDestroy {

  title = 'Edit Line Item';
  sub!: Subscription;

  // lists for the dropdowns
  requests: Request[] = [];
  products: Product[] = [];

  // bound to the form
  lineItem: LineItem = new LineItem();

  constructor(
    private lineItemSvc: LineItemService,
    private requestSvc:  RequestService,
    private productSvc:  ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {

    //dropdowns
    this.requestSvc.list().subscribe(r => this.requests = r);
    this.productSvc.list().subscribe(p => this.products = p);

    // read :id from the URL and pull the existing line-item
    const id = +this.route.snapshot.params['id'];   // unary + → number
    this.sub = this.lineItemSvc.getById(id).subscribe({
      next: li => this.lineItem = li,
      error: err => console.log('Error loading line item', err)
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  save(): void {

    const dto: LineItemDTO = {
      requestId: this.lineItem.requestId,
      productId: this.lineItem.productId,
      quantity:  this.lineItem.quantity
    };

    if (!dto.requestId || !dto.productId || dto.quantity <= 0) {
      alert('Select a request, a product, and quantity.');
      return;
    }

    this.lineItemSvc.update(this.lineItem.id, dto).subscribe({
      next: () => this.router.navigateByUrl('/line-item-list'),
      error: err => {
        console.log('Error updating line item', err);
        alert('Update failed.');
      }
    });
  }
}
