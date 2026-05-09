import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Mandatory for @if
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inject the service to access user information
  auth = inject(AuthService);

  logout() {
    this.auth.logout().subscribe({
      next: () => console.log('Logged out successfully'),
      error: (err) => console.error('Logout error:', err)
    });
  }
}