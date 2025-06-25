import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Request } from '../../../model/request';
import { LineItem } from '../../../model/line-item';

import { RequestService } from '../../../service/request-service';
import { LineItemService } from '../../../service/line-item-service';
import { ProductService } from '../../../service/product-service';

@Component({
  selector: 'app-request-lines',
  standalone: false,
  templateUrl: './request-lines.html',
  styleUrl: './request-lines.css'
})
export class RequestLines implements OnInit, OnDestroy {
  request!: Request;
  lineItems: LineItem[] = [];
  isSubmitted: boolean = false;  // Add this flag to track submission status

  private id!: number;
  private sub?: Subscription;
product: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reqSvc: RequestService,
    private liSvc: LineItemService,
    private productSvc: ProductService
  ) {
    this.request = {
      ...this.request,
      status: 'NEW'  // Ensure status starts as NEW
    };
  }


  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    console.log('request-lines id from URL =', this.id); // ① should log a number

    this.refreshRequest(); //Load the request object
    this.loadLines(); //Load the line items
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


  approveRequest(): void {
    console.log('Approving request with ID:', this.id);

    this.reqSvc.getById(this.id).subscribe({
      next: (request) => {
        request.status = 'APPROVED'; // Update the status
        this.reqSvc.update(request).subscribe({
          next: () => {
            console.log('Request approved successfully!');
            this.refreshRequest(); // refresh request object
            alert('Request approved successfully!');
          },
          error: (err) => console.error('Error approving request:', err)
        });
      },
      error: (err) => console.error('Error retrieving request:', err)
    });
  }

  deleteLine(id: number): void {
    this.liSvc.delete(id).subscribe({
      next: () => this.loadLines(),
      error: (e) => console.log('Delete error', e)
    });
  }

  goAddLine(): void {
    this.router.navigate(['/line-item-create', this.id]); // sends request id as route parameter
  }

  updateRequestTotal(): void {
    // Calculate new total
    const total = this.lineItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    // Update request total
    this.reqSvc.getById(this.id).subscribe({
      next: (request) => {
        // Only update total, preserve existing status
        request.total = total;
        // Create a copy of the request to prevent status changes
        const updatedRequest = { ...request, total };
        this.reqSvc.update(updatedRequest).subscribe({
          next: () => this.refreshRequest(),
          error: (err) => console.error('Error updating request total:', err)
        });
      },
      error: (err) => console.error('Error getting request:', err)
    });
  }

  private refreshRequest(): void {
    this.reqSvc.getById(this.id).subscribe({
      next: (updatedRequest) => {
        this.request = updatedRequest; //Update the local request object
        console.log('Request refreshed:', this.request);
      },
      error: (err) => console.error('Error refreshing request:', err)
    });
  }

  private loadLines(): void {
    this.sub = this.liSvc.linesForRequest(this.id).subscribe({
      next: (li) => (this.lineItems = li),
      error: (e) => console.log('Line-item load error', e)
    });
  }

  submitRequest(): void {
    this.reqSvc.submitForReview(this.id).subscribe({
      next: (updatedRequest) => {
        this.request = updatedRequest;
        this.isSubmitted = true;  // Set flag when request is submitted
        console.log('Request submitted for review:', updatedRequest);
        alert(`Request submitted! Status: ${updatedRequest.status}`);
      },
      error: (err) => {
        console.error('Error submitting request:', err);
        alert('Error submitting request');
      }
    });
  }
}