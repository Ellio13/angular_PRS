import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth-service'; 
//manages authentication logic
@Injectable({
  providedIn: 'root' // can be used everywhere
})
export class AuthGuard implements CanActivate {

  // Constructor to inject dependencies
  constructor(private authSvc: AuthService, private router: Router) {}

   canActivate(): boolean {
    // Check if the user is logged in using AuthService
    if (this.authSvc.isLoggedIn()) {
      return true; // Allow access to the route
    } else {
      // Redirect to the login page if the user is not logged in
      this.router.navigate(['/login']);
      return false; // Deny access to the route
    }
  }
}