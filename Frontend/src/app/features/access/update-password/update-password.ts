import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  newPassword = '';
  message = '';
  error = '';

  hasError = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment && fragment.includes('error=')) {
        this.hasError = true;

        const params = new URLSearchParams(fragment);
        const errorDescription = params.get('error_description');

        if (errorDescription) {
          this.error = errorDescription.replace(/\+/g, ' ');
        } else {
          this.error = this.translate.instant('ACCESS.UPDATE_PASSWORD.MESSAGES.INVALID_LINK');
        }
      }
    });
  }

  async onSubmit() {
    this.message = '';
    this.error = '';

    try {
      await this.authService.updatePassword(this.newPassword);
      this.message = this.translate.instant('ACCESS.UPDATE_PASSWORD.MESSAGES.SUCCESS');

      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.error =
        err.message || this.translate.instant('ACCESS.UPDATE_PASSWORD.MESSAGES.GENERIC_ERROR');
    }
  }
}
