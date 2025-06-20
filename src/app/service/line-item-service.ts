import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LineItem } from '../model/line-item';
import { LineItemDTO } from '../model/line-item-dto';

const URL = 'http://localhost:8080/api/lineitems';   // ← no trailing slash

@Injectable({ providedIn: 'root' })
export class LineItemService {

  constructor(private http: HttpClient) {}

  list(): Observable<LineItem[]> {
    return this.http.get<LineItem[]>(URL + '/');                           // /api/lineitems
  }

  getById(id: number): Observable<LineItem> {
    return this.http.get<LineItem>(URL + '/' + id);                  // /api/lineitems/7
  }

  add(dto: LineItemDTO): Observable<LineItem> {
    return this.http.post<LineItem>(URL, dto);                       // POST /api/lineitems
  }

  update(id: number, dto: LineItemDTO): Observable<LineItem> {
    return this.http.put<LineItem>(URL + '/' + id, dto);             // PUT /api/lineitems/7
  }

  delete(id: number): Observable<LineItem> {
    return this.http.delete<LineItem>(URL + '/' + id);               // DELETE /api/lineitems/7
  }

  /*  ✅ path exactly matches your Spring controller  */
  linesForRequest(reqId: number): Observable<LineItem[]> {
    return this.http.get<LineItem[]>(URL + '/lines-for-request/' + reqId);
  }
}
