import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  async onSubmit() {
    this.message = '';
    this.error = '';
    try {
      await this.authService.resetPassword(this.email);
      this.message = this.translate.instant('ACCESS.FORGOT_PASSWORD.MESSAGES.SUCCESS');
    } catch (err: any) {
      this.error =
        err.message || this.translate.instant('ACCESS.FORGOT_PASSWORD.MESSAGES.GENERIC_ERROR');
    }
  }
}
