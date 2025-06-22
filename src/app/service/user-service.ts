
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { User } from "../model/user";
import { AuthService } from './auth-service';

const URL = "http://localhost:8080/api/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) {}  

  list(): Observable<User[]> {
    // Regular users can't view the full user list
    const user = this.authService.getCurrentUser();
    if (!user?.admin) {
      return throwError(() => new Error('Insufficient permissions to view users'));
    }
    return this.http.get<User[]>(URL + '/');
  }

  add(user: User): Observable<User> {
    if (!this.authService.hasPermission('addUser')) {
      return throwError(() => new Error('Insufficient permissions to add user'));
    }
    return this.http.post<User>(URL, user);  
  }

  update(user: User): Observable<User> {
    if (!this.authService.hasPermission('updateUser')) {
      return throwError(() => new Error('Insufficient permissions to update user'));
    }
    return this.http.put<User>(URL + '/' + user.id, user); 
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(URL + '/' + id);
  }

  delete(id: number): Observable<User> {
    if (!this.authService.hasPermission('deleteUser')) {
      return throwError(() => new Error('Insufficient permissions to delete user'));
    }
    return this.http.delete<User>(URL + '/' + id);
  }
}

