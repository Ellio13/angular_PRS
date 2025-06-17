import { Request } from '../../../model/request';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request-service';

@Component({
  selector: 'app-request-list',
  standalone: false,
  templateUrl: './request-list.html',
  styleUrl: './request-list.css'
})
export class RequestList implements OnInit, OnDestroy {
title: string = "Request List";
subscription! : Subscription;
requests: Request[] = [];


  constructor(private requestSvc: RequestService) {}

  ngOnInit(): void {
    //call requestSvc and populate list of requests
    this.subscription = this.requestSvc.list().subscribe({
      next: (resp) => {
        this.requests = resp;
        console.log("requests", this.requests);
      },
      error: (err) => {
        console.log("Error retrieving requests list.", err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete(id: number) {
    this.subscription = this.requestSvc.delete(id).subscribe({
      next: () => {
        // refresh the request list
        this.subscription = this.requestSvc.list().subscribe((resp) => {
          this.requests = resp;
        });
      },
      error: (err) => {
        console.log('Error deleting request for id: ' + id);
        alert('Error deleting request for id: ' + id);
      },
    });
  }
}
