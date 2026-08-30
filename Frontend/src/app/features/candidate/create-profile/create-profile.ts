import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CandidateService } from '../../../core/services/candidate/candidate.service';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, IconComponent],
  templateUrl: './create-profile.html',
  styleUrls: ['./create-profile.scss'],
})
export class CreateProfileComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private translate = inject(TranslateService);

  // Inject the new Service instead of HttpClient
  private candidateService = inject(CandidateService);

  pageReady = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],

    bio: ['', [Validators.minLength(20), Validators.maxLength(500)]],
    linkedInUrl: ['', [Validators.maxLength(200)]],

    agenda: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
    keyWords: [[] as string[], [Validators.maxLength(20)]],

    partyIds: [[] as string[]],
  });

  ngAfterViewInit(): void {
    this.pageReady.set(true);
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = this.profileForm.getRawValue();
    this.profileForm.disable();

    // Call the service layer
    this.candidateService.createCandidateProfile(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ||
            this.translate.instant('CANDIDATE.CREATE_PROFILE.MESSAGES.GENERIC_ERROR'),
        );
        this.isLoading.set(false);
        this.profileForm.enable();
      },
    });
  }

  onClose() {
    this.router.navigate(['/dashboard']);
  }
}
