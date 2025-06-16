import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user';
import { Vendor } from '../../../model/vendor';
import { UserService } from '../../../service/user-service';
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

  constructor(private vendorSvc: VendorService){
  }

  ngOnInit(): void {
    this.subscription = this.vendorSvc.list().subscribe({
      next: (resp) => {
        this.vendors = resp;
        console.log("vendors", this.vendors);
      },
      error: (err) => {
        console.log("Error retrieving vendor list", err);
      }
    });
  }
}




  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

    delete(id: number) {
    this.subscription = this.userSvc.delete(id).subscribe({
      next: () => {
        // refresh the movie list
        this.subscription = this.userSvc.list().subscribe((resp) => {
          this.users = resp;
        });
      },
      error: (err) => {
        console.log('Error deleting user for id: ' + id);
        alert('Error deleting user for id: ' + id);
      },
    });
  }
  }

