import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineItem } from '../../model/line-item';
import { RequestService } from '../../service/request-service';
import { LineItemService } from '../../service/line-item-service';

@Component({
  selector: 'app-request-lines',
  templateUrl: './request-lines.html',
  styleUrl: './request-lines.css'
})
export class RequestLines implements OnInit {

  request!: Request;
  lineItems: LineItem[] = [];
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reqSvc: RequestService,
    private liSvc: LineItemService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];

    // load request header
    this.reqSvc.getById(this.id).subscribe({
      next: (r: any)  => this.request = r,
      error: (e: any) => console.log('Request load error', e)
    });

    // load line items
    this.loadLines();
  }

  deleteLine(id: number): void {
    this.liSvc.delete(id).subscribe({
      next: () => this.loadLines(),
      error: (e: any) => console.log('Delete error', e)
    });
  }

  goAddLine(): void {
    // navigate to existing line-item-create, passing request id if desired
    this.router.navigate(['/line-item-create'], {
      queryParams: { r: this.id }
    });
  }

  private loadLines(): void {
    this.liSvc.linesForRequest(this.id).subscribe(
      (      li: LineItem[]) => this.lineItems = li
    );
  }
}
