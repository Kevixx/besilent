import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.scss'],
})
export class UpdatePasswordComponent {
  newPassword = '';
  message = '';
  error = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit() {
    this.message = '';
    this.error = '';
    try {
      await this.authService.updatePassword(this.newPassword);
      this.message = 'Password updated successfully! Redirecting...';

      // Redirect them to the login page (or dashboard) after a short delay
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
