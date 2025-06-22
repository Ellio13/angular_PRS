import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { LineItemService } from '../../../service/line-item-service';

@Component({
  selector: 'app-line-item-list',
  standalone: false,
  templateUrl: './line-item-list.html',
  styleUrl: './line-item-list.css'
})
export class LineItemList implements OnInit, OnDestroy {
  title: string = "Line Items List";
  subscription!: Subscription;
  lineItems: LineItem[] = [];
li: any;

  constructor(private lineItemSvc: LineItemService) {}

  ngOnInit(): void {
    this.subscription = this.lineItemSvc.list().subscribe({
      next: (resp: LineItem[]) => {
        this.lineItems = resp;
        console.log("Line Items", this.lineItems);
      },
      error: (err: any) => {
        console.log("Error retrieving line items", err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  delete(lineItemId: number) {
  this.lineItemSvc.delete(lineItemId).subscribe({
    next: (resp) => {
      // Refresh the list after successful deletion
      this.subscription = this.lineItemSvc.list().subscribe({
        next: (resp) => {
          this.lineItems = resp;
          console.log("Line Item deleted.");
        },
        error: (err) => {
          console.log("Error refreshing line items list", err);
        }
      });
    },
    error: (err) => {
      console.log("Error deleting line item", err);
      alert("Error deleting line item: " + err);
    }
  });
  }}