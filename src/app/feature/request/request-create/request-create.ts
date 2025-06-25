import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Request } from '../../../model/request';
import { RequestService } from '../../../service/request-service';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-request-create',
  standalone: false,
  templateUrl: './request-create.html',
  styleUrl: './request-create.css'
})
export class RequestCreate implements OnInit, OnDestroy {
  title: string = "Request-Create";
  subscription!: Subscription;
  newRequest: Request = new Request();

  constructor(
    private requestSvc: RequestService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.newRequest.user = { ...currentUser };
    }
  }

  set userId(value: number) {
    // Do nothing - prevent modification
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cancelRequest() {
    this.router.navigateByUrl('/request-list');
  }

  addRequest() {
    if (!this.newRequest.description || 
        !this.newRequest.justification || 
        !this.newRequest.dateNeeded || 
        !this.newRequest.deliveryMode) {
      console.log("Form must have all fields");
      return;
    }

    const requestToSend = {
      description: this.newRequest.description,
      justification: this.newRequest.justification,
      dateNeeded: this.newRequest.dateNeeded,
      deliveryMode: this.newRequest.deliveryMode,
      userId: this.newRequest.user.id
    };

    console.log("Submitting new request:", requestToSend);

    this.subscription = this.requestSvc.add(requestToSend as any).subscribe({
      next: (createdRequest) => {
        console.log("Request created successfully");
        this.router.navigate(['/line-item-create', createdRequest.id]);
      },
      error: (err) => {
        console.log("Error adding request:", err);
        console.log("Error status:", err.status);
        console.log("Error details:", err.error);
      }
    });
  }
}
