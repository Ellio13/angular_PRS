import { OnInit, OnDestroy, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { RequestService } from "../../../service/request-service";
import { Request } from "../../../model/request";

@Component({
  selector: 'app-request-edit',
  standalone: false,
  templateUrl: './request-edit.html',
  styleUrls: ['./request-edit.css']
})

export class RequestEdit implements OnInit, OnDestroy {
  title: string = "Request-Edit";
  subscription!: Subscription;
  routeSubscription!: Subscription;
  request!: Request;
  requestId!: number;

  constructor(
    private requestSvc: RequestService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.actRoute.params.subscribe((params) => {
      this.requestId = params['id'];
      this.subscription = this.requestSvc.getById(this.requestId).subscribe({
        next: (resp) => {
          this.request = resp;
          console.log('Request loaded:', this.request);
        },
        error: (err) => {
          console.log("Error retrieving request for id: " + this.requestId, err);
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  save() {
    // Create a proper Request object with all required fields
    const requestToSave = {
      id: this.request.id,
      user: this.request.user,
      requestNumber: this.request.requestNumber,
      description: this.request.description,
      justification: this.request.justification,
      dateNeeded: new Date(this.request.dateNeeded),
      deliveryMode: this.request.deliveryMode,
      status: this.request.status,
      total: this.request.total,
      submittedDate: this.request.submittedDate,
      reasonForRejection: this.request.reasonForRejection
    } as Request;

    console.log('Sending to backend:', requestToSave);

    this.requestSvc.update(requestToSave).subscribe({
      next: (resp) => {
        console.log('Save successful:', resp);
        this.router.navigateByUrl('/request-list');
      },
      error: (err) => {
        console.error('Error saving request:', err);
        alert('Failed to save request. Please try again.');
      }
    });
  }
}