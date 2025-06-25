import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Request } from '../../../../model/request';
import { RequestService } from '../../../../service/request-service';
import { AuthService } from '../../../../service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './request-review.html',
  styleUrls: ['./request-review.css']
})
export class RequestReview implements OnInit, OnDestroy {
  title: string = "Review Requests";
  requests: Request[] = [];
  isReviewer: boolean = false;
  isAdmin: boolean = false;
  currentUser: any;
  subscription!: Subscription;

  constructor(
    private requestSvc: RequestService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;
    this.isReviewer = user?.reviewer === true;
    this.isAdmin = user?.admin === true;

    // If user is neither a reviewer nor admin, block access
    if (!this.isReviewer && !this.isAdmin) {
      this.router.navigate(['/request/list']);
      return;
    }

    // Load requests if reviewer or admin
    this.refreshRequests();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  refreshRequests(): void {
    this.subscription = this.requestSvc.listByStatusAndRole('REVIEW', 'REVIEWER').subscribe({
      next: (resp: Request[]) => {
        this.requests = resp.filter(request => request.status === 'REVIEW');
      },
      error: (err: any) => {
        console.error('Error retrieving review requests:', err);
      }
    });
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
      error: (err: any) => {
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
      error: (err: any) => {
        console.error('Rejection error:', err);
      }
    });
  }
}
