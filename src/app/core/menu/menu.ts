import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../service/auth-service'; // adjust path if needed

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
    public authSvc: AuthService  // Injected here
  ) {}

  ngOnInit(): void {
    // Subscribe to login state changes
    this.authSvc.loginState$.subscribe(isLoggedIn => {
      console.log('Login state changed:', isLoggedIn);
      this.updateMenuItems();
    });

    // Subscribe to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.updateMenuItems();
      }
    });

    // Initial menu update
    this.updateMenuItems();
  }

  updateMenuItems(): void {
    this.menuItems = [
      { display: 'Users', href: '/user-list', tooltip: 'Manage Users' },
      { display: 'Vendors', href: '/vendor-list', tooltip: 'Manage Vendors' },
      { display: 'Products', href: '/product-list', tooltip: 'Manage Products' },
      { display: 'Requests', href: '/request-list', tooltip: 'Manage Requests' },
      { display: 'Review', href: '/review', tooltip: 'Review Requests' },
      { display: 'Line Items', href: '/line-item-list', tooltip: 'Manage Line Items' }
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
