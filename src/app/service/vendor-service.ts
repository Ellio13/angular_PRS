
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Vendor } from "../model/vendor";

const URL = "http://localhost:8080/api/Vendors";

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) {}  

  list(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(URL + '/');
  }

  add(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(URL, vendor);  
  }

  update(vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(URL + '/' + vendor.id, vendor); 
  }

  getById(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(URL + '/' + id);
  }

  delete(id: number): Observable<Vendor> {
    return this.http.delete<Vendor>(URL + '/' + id);
  }
}

