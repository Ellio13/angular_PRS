import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor-service';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-vendor-list',
  standalone: false,
  templateUrl: './vendor-list.html',
  styleUrl: './vendor-list.css'
})
export class VendorList implements OnInit, OnDestroy {
  title: string = 'Vendor List';
  subscription!: Subscription;
  vendors: Vendor[] = [];
  isAdmin: boolean = false;

  constructor(private vendorSvc: VendorService, private authService: AuthService) {}

  ngOnInit(): void {
    // Only load data if user is admin
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.admin || false;
    if (!this.isAdmin) {
      return;
    }

    this.subscription = this.vendorSvc.list().subscribe({
      next: (resp) => {
        this.vendors = resp;
        console.log("vendors", this.vendors);
      },
      error: (err: any) => {
        console.log("Error retrieving vendor list", err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete(id: number): void {
    this.subscription = this.vendorSvc.delete(id).subscribe({
      next: () => {
        // Refresh the vendor list after delete
        this.subscription = this.vendorSvc.list().subscribe({
          next: (resp) => {
            this.vendors = resp;
          },
          error: (err: any) => {
            console.log("Error refreshing vendor list", err);
          }
        });
      },
      error: (err: any) => {
        console.log('Error deleting vendor for id: ' + id);
        alert('Error deleting vendor for id: ' + id);
      }
    });
  }
}
