import { Component, OnDestroy, OnInit } from '@angular/core';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor-service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-create',
  standalone: false,
  templateUrl: './vendor-create.html',
  styleUrl: './vendor-create.css'
})


export class VendorCreate implements OnInit, OnDestroy {
  title: string = 'Vendor-Create';
  subscription!: Subscription;
  newVendor: Vendor = new Vendor();

  constructor(private vendorSvc: VendorService,
  private router: Router) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cancel() {
    this.router.navigateByUrl('/vendor-list');
  }

  addVendor() {
    console.log("Submitting new vendor:", this.newVendor);

    // Check if any required field is empty
    if (!this.newVendor.code || 
        !this.newVendor.name || 
        !this.newVendor.address || 
        !this.newVendor.city || 
        !this.newVendor.state || 
        !this.newVendor.zip || 
        !this.newVendor.phoneNumber || 
        !this.newVendor.email) {
      console.log("Form must have all fields");
      return;
    }

    this.subscription = this.vendorSvc.add(this.newVendor).subscribe({
      next: () => {
        this.router.navigateByUrl('/vendor-list');
      },
      error: (err) => {
        console.log("Error adding vendor", err);
      }
    });
  }
}
