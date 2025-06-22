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
  isReviewer: boolean = false;
  currentUser: any;

  constructor(
    private requestSvc: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;
    this.isReviewer = !!(user && (user.reviewer === true || user.admin === true));
    this.refreshRequests();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refreshRequests(): void {
    const user = this.authService.getCurrentUser();
    let requests$;

    if (user && user.reviewer === true) {
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
        console.error("Error refreshing requests list.", err);
      }
    });
  }

  delete(id: number): void {
    this.subscription = this.requestSvc.delete(id).subscribe({
      next: () => {
        // Refresh the request list after delete
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
        console.log('Error deleting request for id: ' + id);
        alert('Error deleting request for id: ' + id);
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
