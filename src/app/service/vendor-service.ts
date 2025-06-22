
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Vendor } from "../model/vendor";
import { AuthService } from './auth-service';

const URL = "http://localhost:8080/api/vendors";

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient, private authService: AuthService) {}  

  list(): Observable<Vendor[]> {
    // Regular users can't view the full vendor list
    const user = this.authService.getCurrentUser();
    if (!user?.admin) {
      return throwError(() => new Error('Insufficient permissions to view vendors'));
    }
    return this.http.get<Vendor[]>(URL + '/');
  }

  add(vendor: Vendor): Observable<Vendor> {
    if (!this.authService.hasPermission('addVendor')) {
      return throwError(() => new Error('Insufficient permissions to add vendor'));
    }
    return this.http.post<Vendor>(URL, vendor);  
  }

  update(vendor: Vendor): Observable<Vendor> {
    if (!this.authService.hasPermission('updateVendor')) {
      return throwError(() => new Error('Insufficient permissions to update vendor'));
    }
    return this.http.put<Vendor>(URL + '/' + vendor.id, vendor); 
  }

  getById(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(URL + '/' + id);
  }

  delete(id: number): Observable<Vendor> {
    if (!this.authService.hasPermission('deleteVendor')) {
      return throwError(() => new Error('Insufficient permissions to delete vendor'));
    }
    return this.http.delete<Vendor>(URL + '/' + id);
  }
}

