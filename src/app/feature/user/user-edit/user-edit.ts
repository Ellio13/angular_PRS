import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../model/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css'
})

export class UserEdit implements OnInit, OnDestroy {
  title: string = "User-Edit";
  subscription!: Subscription;
  user!: User;
  userId!: number;
phoneNumber: any;
g: any;

  constructor(
    private userSvc: UserService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}
ngOnInit(): void {
    this.actRoute.params.subscribe((parms)=>{
      this.userId = parms['id'];
      this.subscription = this.userSvc.getById(this.userId).subscribe({
      next: (resp) => {
          this.user = resp;
      },
      error: (err) => {
        console.log("Error retrieving user for id: " +this.userId, err);
      }
    });
  })
}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

    save() {
    this.userSvc.update(this.user).subscribe({
      next: (resp) => {
        this.user = resp;
        this.router.navigateByUrl('/user-list');
      },
      error: (err) => {
        console.log('error saving user', err);
      }
    });
  }
}
