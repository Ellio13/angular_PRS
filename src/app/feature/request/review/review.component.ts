import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Request } from '../../../model/request';
import { RequestService } from '../../../service/request-service';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div class="p-4">
      <h2>Review Requests</h2>
      
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User</th>
            <th>Description</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of requests">
            <td>{{ r.id }}</td>
            <td>{{ r.user.id }}</td>
            <td>{{ r.description }}</td>
            <td>{{ r.total }}</td>
            <td>{{ r.status }}</td>
            <td>
              <button *ngIf="r.status === 'REVIEW' && isReviewer && r.user.id !== currentUser?.id" (click)="approve(r.id)" title="Only reviewers can approve requests">Approve</button>
              <button *ngIf="r.status === 'REVIEW' && isReviewer && r.user.id !== currentUser?.id" (click)="reject(r.id)" title="Only reviewers can approve requests">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ReviewComponent implements OnInit, OnDestroy {
  requests: Request[] = [];
  isReviewer: boolean = false;
  currentUser: any;
  subscription!: Subscription;

  constructor(
    private requestSvc: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;
    // Check if user is a reviewer (even if they're also an admin)
    this.isReviewer = user?.reviewer === true;
    
    // If user is an admin but not a reviewer, they can view but not approve/reject
    if (user?.admin === true && !this.isReviewer) {
      this.isReviewer = false; // Ensure they can't approve/reject
    }
    this.refreshRequests();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refreshRequests(): void {
    if (this.isReviewer) {
      this.subscription = this.requestSvc.listByStatusAndRole('REVIEW', 'REVIEWER').subscribe({
        next: (resp) => {
          this.requests = resp;
        },
        error: (err) => {
          console.error('Error retrieving review requests:', err);
        }
      });
    }
  }

  approve(id: number): void {
    this.subscription = this.requestSvc.approveRequest(id).subscribe({
      next: (updatedRequest: Request) => {
        const index = this.requests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.requests[index] = { ...updatedRequest };
          this.requests = [...this.requests];
        }
      },
      error: (err) => {
        console.error('Approval error:', err);
      }
    });
  }

  reject(id: number): void {
    const reason = prompt("Enter a reason for rejection:");
    if (!reason) return;

    this.subscription = this.requestSvc.rejectRequest(id, reason).subscribe({
      next: (updatedRequest: Request) => {
        const index = this.requests.findIndex(r => r.id === updatedRequest.id);
        if (index !== -1) {
          this.requests[index] = { ...updatedRequest };
          this.requests = [...this.requests];
        }
      },
      error: (err) => {
        console.error('Rejection error:', err);
      }
    });
  }
}
