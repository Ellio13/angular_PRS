import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user-service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})

export class UserList implements OnInit, OnDestroy {
  title: string = 'User List';
  subscription!: Subscription;
  users: User[] =[];
  isAdmin: boolean = false;

  constructor(private userSvc: UserService, private authService: AuthService) { 
  }

  ngOnInit(): void {
    // Only load data if user is admin
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = currentUser?.admin || false;
    if (!this.isAdmin) {
      return;
    }

    // call userSvrSvc and populate list of users
    this.subscription = this.userSvc.list().subscribe({
      next: (resp) => {
        this.users = resp;
        console.log("users", this.users);
      },
      error: (err) => {
        console.log("Error retrieving users list.", err);
      }
    });
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

