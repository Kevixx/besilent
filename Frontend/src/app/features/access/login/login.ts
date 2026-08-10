import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule, RouterLink, TranslatePipe],
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

  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message.set('');
  }

  async onSubmit() {
    this.message.set('');

    try {
      if (this.isLoginMode) {
        await this.authService.login({ email: this.email, password: this.password });

        this.router.navigate(['/dashboard']);
      } else {
        await this.authService.register({ email: this.email, password: this.password });

        this.messageColor = this.green;
        this.message.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.EMAIL_VERIFICATION'));

        this.isLoginMode = true;
      }
    } catch (err: any) {
      this.messageColor = this.red;
      const errorString = err.message || '';

      if (errorString.includes('Email not confirmed')) {
        this.message.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.VERIFY_EMAIL'));
      } else if (errorString.includes('Invalid login credentials')) {
        this.message.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.INVALID_CREDENTIALS'));
      } else if (errorString.includes('already registered')) {
        this.message.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.ACCOUNT_EXISTS'));
      } else if (errorString.includes('rate limit') || errorString.includes('Too Many Requests')) {
        this.message.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.RATE_LIMIT'));
      } else {
        this.message.set(errorString || this.translate.instant('ACCESS.LOGIN.MESSAGES.UNEXPECTED_ERROR'));
      }
    }
  }
}
