import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth';
import { IconComponent } from '../../../shared/components/icon/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, IconComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.pageReady.set(true);
  }

  email = '';
  message = signal('');
  error = signal('');
  isLoading = false;
  pageReady = signal(false);

  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  async onSubmit() {
    this.resetMessages();
    this.isLoading = true;

    try {
      await this.authService.resetPassword(this.email);
      this.message.set(this.translate.instant('ACCESS.FORGOT_PASSWORD.MESSAGES.SUCCESS'));
    } catch (err: any) {
      const extracted = err?.message || err?.error?.message || err?.statusText || '';
      this.error.set(
        extracted || this.translate.instant('ACCESS.FORGOT_PASSWORD.MESSAGES.GENERIC_ERROR'),
      );
    } finally {
      this.isLoading = false;
    }
  }

  resetMessages() {
    this.message.set('');
    this.error.set('');
  }

  onBack() {
    this.router.navigate(['/login']);
  }
}
