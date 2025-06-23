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
    return this.http.get<Request[]>(`${URL}?status=${status}&role=${role}`);
  }

  // Create a new request
  // Regular users can create requests
  add(request: Request): Observable<Request> {
    return this.http.post<Request>(URL, request);
  }

  // Update an existing request
  // Only admins have permission to modify requests
  update(request: Request): Observable<Request> {
    const user = this.authService.getCurrentUser();
    if (!user?.admin) {
      return throwError(() => new Error('Insufficient permissions to update request'));
    }
    return this.http.put<Request>(URL + '/' + request.id, request);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(URL + '/' + id);
  }

  // Delete a request
  // Only admins have permission to delete requests
  delete(id: number): Observable<Request> {
    const user = this.authService.getCurrentUser();
    if (!user?.admin) {
      return throwError(() => new Error('Insufficient permissions to delete request'));
    }
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
    if (!this.authService.hasPermission('submitForReview')) {
      return throwError(() => new Error('Insufficient permissions to submit for review'));
    }
    return this.http.put<Request>(`${URL}/submit-review/${id}`, null);
  }

}
