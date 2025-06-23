import { Component } from '@angular/core';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="welcome-container" *ngIf="isLoggedIn">
      <h2>Welcome {{ currentUser?.username }}</h2>
      <p>Welcome to the Purchase Request System!</p>
      <p>You are now logged in and ready to manage your purchase requests.</p>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 20px;
      margin: 20px;
      text-align: center;
    }
    h2 {
      color: #333;
    }
    p {
      margin: 10px 0;
      color: #666;
    }
  `]
})
export class WelcomeComponent {
  isLoggedIn = false;
  currentUser: any;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }
}
