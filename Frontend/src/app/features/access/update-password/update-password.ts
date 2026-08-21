import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.scss'],
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.pageReady.set(true);
  }

  pageReady = signal(true);
  newPassword = '';
  repeatPassword = '';
  message = signal('');
  error = signal('');

  isLoading = false;
  hasError = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment && fragment.includes('error=')) {
        this.hasError = true;

        const params = new URLSearchParams(fragment);
        const errorDescription = params.get('error_description');

        if (errorDescription) {
          this.error.set(errorDescription.replace(/\+/g, ' '));
        } else {
          this.error.set(this.translate.instant('ACCESS.UPDATE_PASSWORD.MESSAGES.INVALID_LINK'));
        }
      }
    });
  }

  async onSubmit() {
    this.isLoading = true;
    this.resetMessages();

    try {
      if (this.newPassword !== this.repeatPassword) {
        this.error.set(this.translate.instant('ACCESS.COMMON.PASSWORD_MISMATCH'));
        return;
      }

      await this.authService.updatePassword(this.newPassword);
      this.message.set(this.translate.instant('ACCESS.UPDATE_PASSWORD.MESSAGES.SUCCESS'));

      setTimeout(async () => {
        await this.authService.logout();
        this.router.navigate(['/login']);
      }, 2000);
    } catch (err: any) {
      this.error.set(
        err.message || this.translate.instant('ACCESS.UPDATE_PASSWORD.MESSAGES.GENERIC_ERROR'),
      );
    } finally {
      this.isLoading = false;
    }
  }

  resetMessages() {
    this.message.set('');
    this.error.set('');
  }
}
