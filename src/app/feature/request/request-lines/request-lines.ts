import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../service/request-service';
import { LineItemService } from '../../../service/line-item-service';
import { Request } from '../../../model/request';
import { LineItem } from '../../../model/line-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-request-lines',
  templateUrl: './request-lines.html',
  styleUrl: './request-lines.css'
})
export class RequestLines implements OnInit, OnDestroy {

  request!: Request;
  lineItems: LineItem[] = [];
  id!: number;
  subscription!: Subscription;

  constructor(
    private reqSvc: RequestService,
    private liSvc:  LineItemService,
    private route:  ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];

    // load request header
    this.reqSvc.getById(this.id).subscribe(r => this.request = r);

    // load its line-items
    this.liSvc.linesForRequest(this.id).subscribe(li => this.lineItems = li);
  }
}
