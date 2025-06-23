import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../service/auth-service';

// Menu component that displays navigation links based on user permissions
// Updates dynamically when user logs in/out or navigates through the app // adjust path if needed

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  // Array to store menu items
  menuItems: any[] = [];
  // Current URL of the application
  currentUrl: string = '';

  // Constructor to inject dependencies
  constructor(
    // Handles navigation events
    private router: Router,
    // Manages user authentication and permissions
    public authSvc: AuthService  // Injected here
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication changes and update menu accordingly
    this.authSvc.loginState$.subscribe(isLoggedIn => {
      console.log('Login state changed:', isLoggedIn);
      this.updateMenuItems();
    });

    // Listen for navigation events to update active menu item
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.updateMenuItems();
      }
    });

    // Initial setup of menu items
    this.updateMenuItems();
  }

  updateMenuItems(): void {
    // Build menu items based on user permissions
    const isAdmin = this.authSvc.isAdmin();
    
    this.menuItems = [
      // Admin-only menu items
      ...(isAdmin ? [
        { display: 'Users', href: '/user-list', tooltip: 'Manage Users' },
        { display: 'Vendors', href: '/vendor-list', tooltip: 'Manage Vendors' },
        { display: 'Products', href: '/product-list', tooltip: 'Manage Products' },
        { display: 'Line Items', href: '/line-item-list', tooltip: 'Manage Line Items' }
      ] : []),

      ...(this.authSvc.isReviewer() && !isAdmin ? [
        { display: 'Review', href: '/request-review', tooltip: 'Review Requests' }
      ] : []),

      // General menu items
      { display: 'Requests', href: '/request-list', tooltip: 'Manage Requests' },
      // Reviewer menu ite - shows all requests that need review
    ];
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authSvc.isLoggedIn();
  }
}
