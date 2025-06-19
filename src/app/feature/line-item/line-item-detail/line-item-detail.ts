import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LineItem } from '../../../model/line-item';
import { LineItemService } from '../../../service/line-item-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-line-item-detail',
  standalone: false,
  templateUrl: './line-item-detail.html',
  styleUrl: './line-item-detail.css'
})
export class LineItemDetail implements OnInit, OnDestroy {
title: string = "LineItem-Detail";
subscription!: Subscription;
lineItemId!: number;
lineItem!: LineItem;

constructor(
  private lineItemSvc: LineItemService,
  private router: Router,
  private actRoute: ActivatedRoute
) {}

ngOnInit(): void {
  this.subscription = this.actRoute.params.subscribe((parms) => {
    this.lineItemId = parms['id'];

    // nested subscription stays internal; not assigned to class-level subscription
    this.lineItemSvc.getById(this.lineItemId).subscribe({
      next: (resp: LineItem) => {
        this.lineItem = resp;
      },
      error: (err: any) => {
        console.log("Error retrieving line item for id: " + this.lineItemId, err);
      }
    });
  });
}


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete() {
    this.lineItemSvc.delete(this.lineItemId).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/line-item-list');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}