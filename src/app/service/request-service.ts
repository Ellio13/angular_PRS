import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Request } from "../model/request";
import { AuthService } from './auth-service';
import { Router } from "@angular/router";

// Service that handles all request-related operations
// Manages CRUD operations and permission checks for requests

const URL = "http://localhost:8080/api/requests";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all requests (viewable by all users)
  list(): Observable<Request[]> {
    return this.http.get<Request[]>(URL);
  }

  // Get requests filtered by status and user role
  // Used for displaying requests specific to user's role
  listByStatusAndRole(status: string, role: string): Observable<Request[]> {
    const user = this.authService.getCurrentUser();
    let params = new URLSearchParams();

    if (role === 'USER') {
      // For regular users, filter by their own requests
      params.append('userId', user?.id.toString() || '');
    } else if (role === 'REVIEWER') {
      // For reviewers, filter by REVIEW status
      params.append('status', 'REVIEW');
    }

    return this.http.get<Request[]>(`${URL}?${params.toString()}`);
  }

  // Create a new request
  // Regular users can create requests
  add(request: Request): Observable<Request> {
    return this.http.post<Request>(URL, request);
  }

  // Update an existing request
  // Users can edit their own requests, admins can edit any request
  update(request: Request): Observable<Request> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.admin && request.user.id !== currentUser?.id) {
      return throwError(() => new Error('Insufficient permissions to update request'));
    }
    return this.http.put<Request>(URL + '/' + request.id, request);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(URL + '/' + id);
  }

  // Delete a request
  // Only admins have permission to delete requests
  delete(id: number, request?: Request): Observable<Request> {
    return this.http.delete<Request>(URL + '/' + id);
  }
  
  

  approveRequest(id: number): Observable<Request> {
    if (!this.authService.canApproveRejectRequests()) {
      return throwError(() => new Error('Insufficient permissions to approve request'));
    }
    return this.http.put<Request>(`${URL}/approve/${id}`, {});
  }

  rejectRequest(id: number, reason: string): Observable<Request> {
    if (!this.authService.canApproveRejectRequests()) {
      return throwError(() => new Error('Insufficient permissions to reject request'));
    }
    return this.http.put<Request>(`${URL}/reject/${id}`, { reason });
  }
 
  submitForReview(id: number): Observable<Request> {
    // Allow all authenticated users to submit requests for review
    return this.http.put<Request>(`${URL}/submit-review/${id}`, null);
  }

}
