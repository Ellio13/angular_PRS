import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Request } from "../model/request";
import { AuthService } from './auth-service';

const URL = "http://localhost:8080/api/requests";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  list(): Observable<Request[]> {
    return this.http.get<Request[]>(URL);
  }

  listByStatusAndRole(status: string, role: string): Observable<Request[]> {
    return this.http.get<Request[]>(`${URL}?status=${status}&role=${role}`);
  }

  add(request: Request): Observable<Request> {
    return this.http.post<Request>(URL, request);
  }

  update(request: Request): Observable<Request> {
    // Only admins can update requests
    const user = this.authService.getCurrentUser();
    if (!user?.admin) {
      return throwError(() => new Error('Insufficient permissions to update request'));
    }
    return this.http.put<Request>(URL + '/' + request.id, request);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(URL + '/' + id);
  }

  delete(id: number): Observable<Request> {
    // Only admins can delete requests
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
