import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule],
})
export class LoginComponent {
  isLoginMode = true;

  email = '';
  password = '';
  role = 1;

  message = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message.set('');
  }

  onSubmit() {
    this.message.set('');

    if (this.isLoginMode) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          // The HTML will now update instantly without a second click!
          this.message.set('Login successful!');
          this.router.navigate(['/directory']);
        },
        error: (err) => {
          this.message.set('Login failed. Please check your credentials.');
        },
      });
    } else {
      this.authService
        .register({ email: this.email, password: this.password, role: this.role })
        .subscribe({
          next: (res) => {
            this.isLoginMode = true;
            this.message.set('Registration successful! You can now log in.');
          },
          error: (err) => {
            this.message.set('Registration failed. Please try again.');
          },
        });
    }
  }
}
