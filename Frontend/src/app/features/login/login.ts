import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule],
})
export class LoginComponent {
  isLoginMode = true;

  // Form fields
  email = '';
  password = '';
  role = 1; // Default to 1 (Consultant) for new registrations
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      // Execute Login
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          console.log('Login successful!', res);

          this.message = 'Login successful!';
          this.router.navigate(['/directory']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.message = 'Login failed. Please check your credentials.';
        },
      });
    } else {
      // Execute Register
      this.authService
        .register({ email: this.email, password: this.password, role: this.role })
        .subscribe({
          next: (res) => {
            console.log('Registration successful!', res);

            // Automatically flip back to login mode so they can sign in
            this.isLoginMode = true;
            this.message = 'Registration successful! You can now log in.';
          },
          error: (err) => {
            console.error('Registration failed', err);
            this.message = 'Registration failed. Please try again.';
          },
        });
    }
  }

  resetMessage() {
    if (this.message) {
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  }
}
