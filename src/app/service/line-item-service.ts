import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LineItem } from '../model/line-item';
import { LineItemDTO } from '../model/line-item-dto';
import { AuthService } from './auth-service';

const URL = 'http://localhost:8080/api/lineitems';   // ← no trailing slash

@Injectable({ providedIn: 'root' })
export class LineItemService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  list(): Observable<LineItem[]> {
    if (!this.authService.hasPermission('listLineItems')) {
      return throwError(() => new Error('Insufficient permissions to view line items'));
    }
    return this.http.get<LineItem[]>(URL + '/');  // /api/lineitems
  }

  getById(id: number): Observable<LineItem> {
    return this.http.get<LineItem>(URL + '/' + id); // /api/lineitems/7
  }

  add(dto: LineItemDTO): Observable<LineItem> {
    // Allow all authenticated users to add line items
    return this.http.post<LineItem>(URL, dto);   // POST /api/lineitems
  }

  update(id: number, dto: LineItemDTO): Observable<LineItem> {
    if (!this.authService.hasPermission('updateLineItem')) {
      return throwError(() => new Error('Insufficient permissions to update line item'));
    }
    return this.http.put<LineItem>(URL + '/' + id, dto);   // PUT /api/lineitems/7
  }

  delete(id: number): Observable<LineItem> {
    // Allow all authenticated users to delete line items
    return this.http.delete<LineItem>(URL + '/' + id);  // DELETE /api/lineitems/7
  }

  //returns array of line items
  linesForRequest(reqId: number): Observable<LineItem[]> {
    // Allow all authenticated users to view line items
    return this.http.get<LineItem[]>(URL + '/lines-for-request/' + reqId);
  // /api/lines-for-request/20  --this number is the request ID
  }
}
