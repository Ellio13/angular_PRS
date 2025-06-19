import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LineItem } from "../model/line-item";
import { LineItemDTO } from "../model/line-item-dto";

const URL = "http://localhost:8080/api/lineitems/";

@Injectable({
  providedIn: 'root'
})
export class LineItemService {

  constructor(private http: HttpClient) {}

  list(): Observable<LineItem[]> {
    return this.http.get<LineItem[]>(URL);
  }

  delete(id: number): Observable<LineItem> {
    return this.http.delete<LineItem>(URL + '/' + id);
  }

    getById(id: number): Observable<LineItem> {
    return this.http.get<LineItem>(`${URL}/${id}`);
    }

add(dto: LineItemDTO): Observable<LineItem> {
  return this.http.post<LineItem>("http://localhost:8080/api/lineitems", dto);
}

}