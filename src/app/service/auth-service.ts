import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../model/user';


// Authentication service that manages user login state and permissions
// Provides methods for login, logout, and checking user permissions
// Stores user data in localStorage for persistence between page reloads

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
    // Initialize current user from localStorage or null if not logged in
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
    // Initialize login state observable
    this.loginStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
    this.loginState$ = this.loginStateSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    // Authenticate user with backend and store credentials
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user: User) => {
        // Store user data in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Update current user subject
        this.currentUserSubject.next(user);
        // Update login state
        this.loginStateSubject.next(true);
      })
    );
  }

  logout(): void {
    // Clear user data and update login state
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loginStateSubject.next(false);
  }

  // Get current logged in user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
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

  // Check if user is an admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.admin || false;
  }

  // Check if user has permission to perform an action
  hasPermission(action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (!user.reviewer && !user.admin && action ==='viewRequests') {
      return false;
    }
    // Regular users can only perform actions in the defined list
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
//changes true/false login state observable based on current user
  updateLoginState(): void {
    this.loginStateSubject.next(this.isLoggedIn());
  }
}
