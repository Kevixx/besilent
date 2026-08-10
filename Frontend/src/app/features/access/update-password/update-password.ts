import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  newPassword = '';
  message = '';
  submitError = '';

  // New properties for error handling
  hasError = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Allows us to read the URL

  ngOnInit() {
    // Read the # fragment from the URL (e.g., #error=access_denied)
    this.route.fragment.subscribe((fragment) => {
      if (fragment && fragment.includes('error=')) {
        this.hasError = true;

        // Use URLSearchParams to extract the exact error message
        const params = new URLSearchParams(fragment);
        const errorDescription = params.get('error_description');

        if (errorDescription) {
          // Replace the '+' signs in the URL with actual spaces
          this.errorMessage = errorDescription.replace(/\+/g, ' ');
        } else {
          this.errorMessage = 'The password reset link is invalid or has expired.';
        }
      }
    });
  }

  async onSubmit() {
    this.message = '';
    this.submitError = '';
    try {
      await this.authService.updatePassword(this.newPassword);
      this.message = 'Password updated successfully! Redirecting...';

      // Send them back to login
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.submitError = err.message || 'Failed to update password.';
    }
  }
}
