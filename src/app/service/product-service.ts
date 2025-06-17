
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../model/product";

const URL = "http://localhost:8080/api/products";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}  

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(URL + '/');
  }

  add(product: Product): Observable<Product> {
    return this.http.post<Product>(URL, product);  
  }

  update(product: Product): Observable<Product> {
    return this.http.put<Product>(URL + '/' + product.id, product); 
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(URL + '/' + id);
  }

  delete(id: number): Observable<Product> {
    return this.http.delete<Product>(URL + '/' + id);
  }
}

