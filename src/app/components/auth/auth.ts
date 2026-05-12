import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthenticationComponent {
  email = '';
  pass = '';
  isLogin = true;
  selectedRole: 'admin' | 'player' = 'player';

  constructor(private authService: AuthService, private router: Router) {}

  handleAuth() {
    if (this.isLogin) {
      this.authService.login(this.email, this.pass).subscribe({
        next: () => this.router.navigate(['/players']),
        error: (err: Error) => alert(err.message)
      });
    } else {
      this.authService.register(this.email, this.pass, this.selectedRole)
        .then(() => {
          alert('Account Created as ' + this.selectedRole);
          this.router.navigate(['/players']);
        })
        .catch(err => alert(err.message));
    }
  }
}