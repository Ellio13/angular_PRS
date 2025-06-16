import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor-service';

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

  constructor(private vendorSvc: VendorService) {}

  ngOnInit(): void {
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
