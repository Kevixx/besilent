import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
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
export class LoginComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // mark component as ready after view init so the UI doesn't briefly flash
    // when switching windows or during initial render
    this.pageReady.set(true);
  }

  pageReady = signal(false);
  isLoginMode = true;

  email = '';
  password = '';
  repeatPassword = '';
  name = '';

  message = signal('');
  error = signal('');

  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  @ViewChild('cardRef') cardRef!: ElementRef<HTMLDivElement>;

  //Inject the tool needed to measure and update DOM state
  private cdr = inject(ChangeDetectorRef);

  toggleMode() {
    // Measure the current height of the card (e.g., Login height)
    const startHeight = this.cardRef.nativeElement.clientHeight;

    // Change the state
    this.isLoginMode = !this.isLoginMode;
    this.resetMessages();

    // Force Angular to instantly add/remove the @if elements in the DOM
    this.cdr.detectChanges();

    // Measure the new target height (e.g., Register height)
    const targetHeight = this.cardRef.nativeElement.clientHeight;

    // Animate from exact Start Pixel to exact Target Pixel using Web Animations API
    const element = this.cardRef.nativeElement;
    element.style.overflow = 'hidden';
    element.style.height = `${startHeight}px`;

    const player = element.animate(
      [{ height: `${startHeight}px` }, { height: `${targetHeight}px` }],
      {
        duration: 250,
      },
    );

    for (const child of this.cardRef.nativeElement.children) {
      child.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
      });
    }

    // Cleanup once finished so card can resize naturally
    player.onfinish = () => {
      element.style.height = 'auto';
      element.style.overflow = '';
    };
  }

  async onSubmit() {
    this.resetMessages();

    try {
      this.isLoading = true;
      if (this.isLoginMode) {
        await this.authService.login({ email: this.email, password: this.password });

        this.router.navigate(['/dashboard']);
      } else {
        if (this.password !== this.repeatPassword) {
          this.error.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.PASSWORD_MISMATCH'));
          return;
        }

        await this.authService.register({
          email: this.email,
          password: this.password,
          name: this.name,
        });

        this.message.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.EMAIL_VERIFICATION'));

        this.password = '';
        this.repeatPassword = '';
        this.name = '';

        this.isLoginMode = true;
      }
    } catch (err: any) {
      this.message.set('');
      this.error.set(err.message || '');
      const errorString = this.error();

      if (errorString.includes('Email not confirmed')) {
        this.error.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.VERIFY_EMAIL'));
      } else if (errorString.includes('Invalid login credentials')) {
        this.error.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.INVALID_CREDENTIALS'));
      } else if (errorString.includes('already registered')) {
        this.error.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.ACCOUNT_EXISTS'));
      } else if (errorString.includes('rate limit') || errorString.includes('Too Many Requests')) {
        this.error.set(this.translate.instant('ACCESS.LOGIN.MESSAGES.RATE_LIMIT'));
      } else {
        this.error.set(
          errorString || this.translate.instant('ACCESS.LOGIN.MESSAGES.UNEXPECTED_ERROR'),
        );
      }
    } finally {
      this.isLoading = false;
    }
  }

  resetMessages() {
    this.message.set('');
    this.error.set('');
  }
}
