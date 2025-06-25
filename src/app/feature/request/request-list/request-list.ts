import { Request } from '../../../model/request';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
  isReviewer: boolean = false;
  isCurrentUserAdmin: boolean = false;
  currentUser: any;

  constructor(
    private requestSvc: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;
    this.isReviewer = !!(user && (user.reviewer === true || user.admin === true));
    this.isCurrentUserAdmin = !!(user && user.admin === true);
    this.refreshRequests();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refreshRequests(): void {
    const user = this.authService.getCurrentUser();
    let requests$;

    requests$ = this.requestSvc.list().pipe(
      map((requests: Request[]) => {
        // If user is not admin, filter to show only their requests
        if (user && !this.authService.isAdmin()) {
          return requests.filter((req: Request) => req.user.id === user.id);
        }
        return requests;
      })
    );

    this.subscription = requests$.subscribe({
      next: (resp) => {
        this.requests = resp;
        console.log("requests", this.requests);
      },
      error: (err) => {
        console.error("Error refreshing requests list.", err);
      }
    });
  }

  delete(id: number): void {
    const request = this.requests.find(r => r.id === id);
    if (!request) {
      alert('Request not found.');
      return;
    }
  
    this.subscription = this.requestSvc.delete(id, request).subscribe({
      next: () => this.refreshRequests(),
      error: (err: any) => {
        console.error('Error deleting request:', err);
        alert(err?.message || 'Unable to delete request.');
      }
    });
  }
  

  approve(id: number): void {
    this.subscription = this.requestSvc.approveRequest(id).subscribe({
      next: () => {
        // Refresh the request list after approval
        this.subscription = this.requestSvc.list().subscribe({
          next: (resp) => {
            this.requests = resp;
          },
          error: (err: any) => {
            console.log("Error refreshing request list", err);
          }
        });
      },
      error: (err: any) => {
        console.log('Error approving request', err);
        alert('Error approving request: ' + err.message);
      }
    });
  }

  reject(id: number): void {
    this.subscription = this.requestSvc.rejectRequest(id, 'Rejected by reviewer').subscribe({
      next: () => {
        // Refresh the request list after rejection
        this.subscription = this.requestSvc.list().subscribe({
          next: (resp) => {
            this.requests = resp;
          },
          error: (err: any) => {
            console.log("Error refreshing request list", err);
          }
        });
      },
      error: (err: any) => {
        console.log('Error rejecting request', err);
        alert('Error rejecting request: ' + err.message);
      }
    });
  }
}
