import { Component } from '@angular/core';
import { AuthService } from './service/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'prs-ng';

  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUsername(): string {
    const user = this.authService.getCurrentUser();
    return user?.username || '';
  }
}
