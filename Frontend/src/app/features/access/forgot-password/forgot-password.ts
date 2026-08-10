import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  private authService = inject(AuthService);

  async onSubmit() {
    this.message = '';
    this.error = '';
    try {
      await this.authService.resetPassword(this.email);
      this.message = 'Check your email for the password reset link!';
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
