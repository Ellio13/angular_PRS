
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Product } from "../model/product";
import { AuthService } from './auth-service';

const URL = "http://localhost:8080/api/products";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) {}  

  list(): Observable<Product[]> {
    // Regular users can view products when creating line items
    return this.http.get<Product[]>(URL + '/');
  }

  add(product: Product): Observable<Product> {
    if (!this.authService.hasPermission('addProduct')) {
      return throwError(() => new Error('Insufficient permissions to add product'));
    }
    return this.http.post<Product>(URL, product);  
  }

  update(product: Product): Observable<Product> {
    if (!this.authService.hasPermission('updateProduct')) {
      return throwError(() => new Error('Insufficient permissions to update product'));
    }
    return this.http.put<Product>(URL + '/' + product.id, product); 
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(URL + '/' + id);
  }

  delete(id: number): Observable<Product> {
    if (!this.authService.hasPermission('deleteProduct')) {
      return throwError(() => new Error('Insufficient permissions to delete product'));
    }
    return this.http.delete<Product>(URL + '/' + id);
  }
}

