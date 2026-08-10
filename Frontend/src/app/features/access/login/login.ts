import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule, RouterLink],
})
export class LoginComponent {
  isLoginMode = true;

  email = '';
  password = '';
  role = 1;

  red = 'var(--error-color)';
  green = 'var(--success-color)';
  messageColor = '';
  message = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message.set('');
  }

  async onSubmit() {
    this.message.set('');

    try {
      if (this.isLoginMode) {
        await this.authService.login({ email: this.email, password: this.password });

        // Success! Send them to the dashboard
        this.router.navigate(['/dashboard']);
      } else {
        await this.authService.register({ email: this.email, password: this.password });

        // Registration successful, but they need to verify
        this.messageColor = this.green;
        this.message.set(
          'Success! Please check your email inbox to verify your account before logging in.',
        );

        this.isLoginMode = true;
      }
    } catch (err: any) {
      // Intercept and translate Supabase's raw backend errors
      this.messageColor = this.red;
      const errorString = err.message || '';

      if (errorString.includes('Email not confirmed')) {
        this.message.set(
          'You need to verify your email address. Please check your inbox for the activation link.',
        );
      } else if (errorString.includes('Invalid login credentials')) {
        this.message.set('Incorrect email or password. Please try again.');
      } else if (errorString.includes('already registered')) {
        this.message.set('An account with this email address already exists.');
      } else if (errorString.includes('rate limit') || errorString.includes('Too Many Requests')) {
        this.message.set('Too many attempts. Please wait a moment and try again.');
      } else {
        this.message.set(errorString || 'An unexpected error occurred. Please try again.');
      }
    }
  }
}
