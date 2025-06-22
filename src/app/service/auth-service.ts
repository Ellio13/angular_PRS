import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../model/user';


//authentication service - these functions store user login state in local memory,
//remove login state at logout, and allow comparisons between logged in user
//and user records in the database

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  public loginStateSubject: BehaviorSubject<boolean>;
  public loginState$: Observable<boolean>;
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.loginStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
    this.loginState$ = this.loginStateSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.loginStateSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loginStateSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Check if user is a reviewer
  isReviewer(): boolean {
    const user = this.getCurrentUser();
    return user?.reviewer || false;
  }

  // Check if user can approve/reject requests
  canApproveRejectRequests(): boolean {
    const user = this.getCurrentUser();
    return user?.reviewer || false;  // Only reviewers can approve/reject
  }

  // List of actions that regular users are allowed to perform
  private allowedRegularUserActions = [
    'createRequest',
    'requestLines',
    'viewProducts',
    'viewVendors'
  ];

  // List of actions that are restricted to admins only
  private adminOnlyActions = [
    'listUsers',
    'addUser',
    'updateUser',
    'deleteUser',
    'listVendors',
    'addVendor',
    'updateVendor',
    'deleteVendor',
    'listProducts',
    'addProduct',
    'updateProduct',
    'deleteProduct',
    'listRequests',
    'submitForReview',
    'listLineItems',
    'addLineItem',
    'updateLineItem',
    'deleteLineItem'
  ];

  // Check if user has permission to perform an action
  hasPermission(action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Regular users can only perform actions in the allowed list
    if (!user.reviewer && !user.admin) {
      if (this.adminOnlyActions.includes(action)) {
        return false;
      }
      return this.allowedRegularUserActions.includes(action);
    }

    // Reviewers and admins can do everything
    return true;
  }

  // Check if user is reviewer or admin
  isReviewerOrAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? (user.reviewer || user.admin) : false;
  }

  updateLoginState(): void {
    this.loginStateSubject.next(this.isLoggedIn());
  }
}
