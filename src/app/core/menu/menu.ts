import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  menuItems: any[] = [];
  currentUrl: string = '';

  constructor(
    private router: Router,
    public authSvc: AuthService
  ) {}

  ngOnInit(): void {
    // Update menu on login state change
    this.authSvc.loginState$.subscribe(isLoggedIn => {
      console.log('Login state changed:', isLoggedIn);
      this.updateMenuItems();
    });

    // Update current route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.updateMenuItems();
      }
    });

    this.updateMenuItems();
  }

  updateMenuItems(): void {
    const isAdmin = this.authSvc.isAdmin();
    const isReviewer = this.authSvc.isReviewer();

    this.menuItems = [
      ...(isAdmin ? [
        { display: 'Users', href: '/user-list', tooltip: 'Manage Users' },
        { display: 'Vendors', href: '/vendor-list', tooltip: 'Manage Vendors' },
        { display: 'Products', href: '/product-list', tooltip: 'Manage Products' },
        { display: 'Line Items', href: '/line-item-list', tooltip: 'Manage Line Items' }
      ] : []),

      ...(isReviewer ? [
        { display: 'Review', href: '/request-review', tooltip: 'Review Requests' }
      ] : []),

      { display: 'Requests', href: '/request-list', tooltip: 'Manage Requests' }
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
