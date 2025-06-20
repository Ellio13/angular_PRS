import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Request } from "../model/request";

const URL = "http://localhost:8080/api/requests";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {}

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
    return this.http.put<Request>(URL + '/' + request.id, request);
  }

  getById(id: number): Observable<Request> {
    return this.http.get<Request>(URL + '/' + id);
  }

  delete(id: number): Observable<Request> {
    return this.http.delete<Request>(URL + '/' + id);
  }

  approveRequest(id: number): Observable<Request> {
    return this.http.put<Request>(`${URL}/approve/${id}`, {});
  }

  rejectRequest(id: number, reason: string): Observable<Request> {
    return this.http.put<Request>(`${URL}/reject/${id}`, { reason });
  }
 
submitForReview(id: number): Observable<Request> {
  return this.http.put<Request>(`${URL}/submit-review/${id}`, null);
}

}
