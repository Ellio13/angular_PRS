import { Request } from '../../../model/request';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../../service/request-service';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-request-list',
  standalone: false,
  templateUrl: './request-list.html',
  styleUrl: './request-list.css'
})
export class RequestList implements OnInit, OnDestroy {
  title: string = "Request List";
  subscription!: Subscription;
  requests: Request[] = [];
  reqSvc: any;
  request: any;

  constructor(
    private requestSvc: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    let requests$;

    if (user && user.role === 'REVIEWER') {
      requests$ = this.requestSvc.listByStatusAndRole('REVIEW', 'REVIEWER');
    } else {
      requests$ = this.requestSvc.list();
    }

    this.subscription = requests$.subscribe({
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

  approve(id: number) {
    console.log('Approving request with id:', id);

    this.subscription = this.requestSvc.approveRequest(id).subscribe({
      next: (updatedRequest: Request) => {
        console.log('Request approved by reviewer:', updatedRequest);

        const index = this.requests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.requests[index] = { ...updatedRequest };
          this.requests = [...this.requests]; // Force Angular change detection
        }

        alert('Request approved successfully!');
      },
      error: (err: { message: string; }) => {
        console.error('Approval error:', err);
        alert('Error approving request: ' + err.message);
      }
    });
  }

  reject(id: number) {
    const reason = prompt("Enter a reason for rejection:");
    if (!reason) {
      return;
    }

    this.subscription = this.requestSvc.rejectRequest(id, reason).subscribe({
      next: (updatedRequest: Request) => {
        console.log('Request rejected by reviewer:', updatedRequest);

        const index = this.requests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.requests[index] = { ...updatedRequest };
          this.requests = [...this.requests]; // Trigger UI update
        }

        alert('Request rejected successfully!');
      },
      error: (err: { message: string; }) => {
        console.error('Rejection error:', err);
        alert('Error rejecting request: ' + err.message);
      }
    });
  }

  delete(id: number) {
    this.subscription = this.requestSvc.delete(id).subscribe({
      next: () => {
        this.refreshRequests();
        alert('Request deleted successfully!');
      },
      error: (err) => {
        console.log('Error deleting request for id: ' + id);
        alert('Error deleting request for id: ' + id);
      },
    });
  }
  refreshRequests() {
    throw new Error('Method not implemented.');
  }

private refreshRequest(): void {
  this.reqSvc.getById(this.id).subscribe({
    next: (updatedRequest: any) => {
      this.request = updatedRequest;
      console.log('Request refreshed:', this.request);

      // 🟡 Trigger backend logic to re-evaluate approval status
      this.reqSvc.submitForReview(this.id).subscribe({
        next: (autoUpdatedRequest: any) => {
          this.request = autoUpdatedRequest;
          console.log('Auto-reviewed request:', autoUpdatedRequest);
        },
        error: (err: any) => console.error('Error submitting for review:', err)
      });
    },
    error: (err: any) => console.error('Error refreshing request:', err)
  });
}  id(id: any) {
    throw new Error('Method not implemented.');
  }
}
