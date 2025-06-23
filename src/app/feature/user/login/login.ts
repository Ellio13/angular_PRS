import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth-service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class UserLogin implements OnInit {
  title: string = 'User-Login';
  subscription!: Subscription;
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Clear any stored credentials if user is not logged in
    if (!this.authService.isLoggedIn()) {
      localStorage.removeItem('currentUser');
    }
  }

  login(form: NgForm): void {
    if (!form.valid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    console.log('Login attempt:', { username: this.username, password: '***' });
    
    this.subscription = this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.loading = false;  // Reset loading state
        // The auth service will handle storing the user and updating state
        this.router.navigate(['/']);
        form.reset();
      },
      error: (error) => {
        this.loading = false;  // Reset loading state
        console.error('Login error details:', error);
    this.errorMessage = 'Invalid login - incorrect user/password combo';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Helper method to clear fields
  clearForm(): void {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }
}
