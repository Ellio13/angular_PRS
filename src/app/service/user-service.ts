
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../model/user";

const URL = "http://localhost:8080/api/Users";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}  

  list(): Observable<User[]> {
    return this.http.get<User[]>(URL + '/');
  }

  add(user: User): Observable<User> {
    return this.http.post<User>(URL, user);  
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(URL + '/' + user.id, user); 
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(URL + '/' + id);
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(URL + '/' + id);
  }
}

