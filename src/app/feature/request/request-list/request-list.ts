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
        this.refreshRequests();
        alert('Request deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting request:', err);
        alert('Error deleting request for id: ' + id);
      },
    });
  }
}
