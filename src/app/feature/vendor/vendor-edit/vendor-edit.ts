import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../model/vendor';
import { VendorService } from '../../../service/vendor-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-edit',
  standalone: false,
  templateUrl: './vendor-edit.html',
  styleUrl: './vendor-edit.css'
})
export class VendorEdit implements OnInit, OnDestroy {
  title: string = "Vendor-Edit";
  subscription!: Subscription;
  vendor!: Vendor;
  vendorId!: number;


constructor(
  private vendorSvc: VendorService,
  private router: Router,
  private actRoute: ActivatedRoute
) {}

ngOnInit(): void {
    this.actRoute.params.subscribe((parms)=>{
      this.vendorId = parms['id'];
      this.subscription = this.vendorSvc.getById(this.vendorId).subscribe({
      next: (resp) => {
          this.vendor = resp;
      },
      error: (err) => {
        console.log("Error retrieving vendor for id: " +this.vendorId, err);
      }
    });
  })
}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

    save() {
    this.vendorSvc.update(this.vendor).subscribe({
      next: (resp) => {
        this.vendor = resp;
        this.router.navigateByUrl('/vendor-list');
      },
      error: (err) => {
        console.log('error saving vendor', err);
      }
    });
  }
}
