import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.html',
  styleUrl: './user-create.css'
})
export class UserCreate implements OnInit, OnDestroy {
  title: string = 'User-Create';
  subscription!: Subscription;
  newUser: User = new User();

  constructor(private userSvc: UserService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addUser() {
    console.log("Submitting new user:", this.newUser);

    // Check if all required string fields are filled
    const requiredFields = [
      this.newUser.username,
      this.newUser.password,
      this.newUser.firstName,
      this.newUser.lastName,
      this.newUser.phoneNumber,
      this.newUser.email
    ];
    
    if (requiredFields.some(field => !field)) {
      console.log("All required fields must be filled");
      return;
    }

    this.subscription = this.userSvc.add(this.newUser).subscribe({
      next: () => {
        this.router.navigateByUrl('/user-list');
      },
      error: (err) => {
        console.log("Error adding user", err);
      }
    });
  }

  cancelUser() {
    console.log("Canceling user create");
    this.router.navigateByUrl('/user-list');
  }
}
