import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Request } from '../../../model/request';  // Add this import
import { RequestService } from '../../../service/request-service';

@Component({
  selector: 'app-request-create',
  standalone: false,
  templateUrl: './request-create.html',
  styleUrl: './request-create.css'
})
export class RequestCreate implements OnInit, OnDestroy {
  title: string = "Request-Create";
  subscription!: Subscription;
  newRequest: Request = new Request();  // Fix variable name

  constructor(
    private requestSvc: RequestService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

 addRequest() {
  // Transform to the structure your backend expects
  const requestToSend = {
    description: this.newRequest.description,
    justification: this.newRequest.justification,
    dateNeeded: this.newRequest.dateNeeded,
    deliveryMode: this.newRequest.deliveryMode,
    userId: this.newRequest.user.id  // Send just the user ID
  };
  
  console.log("Submitting new request:", requestToSend);
  
  this.subscription = this.requestSvc.add(requestToSend as any).subscribe({
    next: () => {
      console.log("Request created successfully");
      this.router.navigateByUrl('/request-list');
    },
    error: (err) => {
      console.log("Error adding request:", err);
      console.log("Error status:", err.status);
      console.log("Error details:", err.error);
    }
  });
}}