import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  menuItems: any[] = [];
  currentUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateMenuItems();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  updateMenuItems(): void {
    this.menuItems = [
      { display: 'Users', href: '/user-list', tooltip: 'Manage Users' },
      { display: 'Vendors', href: '/vendor-list', tooltip: 'Manage Vendors' },
      { display: 'Products', href: '/product-list', tooltip: 'Manage Products' },
      { display: 'Requests', href: '/request-list', tooltip: 'Manage Requests' },
      { display: 'Line Items', href: '/line-item-list', tooltip: 'Manage Line Items' },
      { display: 'Login', href: '/login', tooltip: 'Login to access features' }
    ];
  }

  logout(): void {
    // Optional: remove or adjust this if login isn't being used anymore
    this.router.navigate(['/login']);
  }

  // Optional: can be removed if not used in template anymore
  isLoggedIn(): boolean {
    return true;
  }
}
