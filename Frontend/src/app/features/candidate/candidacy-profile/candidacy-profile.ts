import { Component, inject, OnInit, signal } from '@angular/core'; // Removed AfterViewInit
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CandidateService } from '../../../core/services/candidate/candidate.service';
import { IconComponent } from '../../../shared/components/icon/icon';
import { CandidateDto } from '../../../shared/dtos/candidacy-dto';

@Component({
  selector: 'app-candidacy-profile',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, IconComponent],
  templateUrl: './candidacy-profile.html',
  styleUrls: ['./candidacy-profile.scss'],
})
export class CandidacyProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private candidateService = inject(CandidateService);

  pageReady = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  candidacyExists = signal(false);

  private candidate: CandidateDto | null = null;

  profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    bio: ['', [Validators.minLength(20), Validators.maxLength(500)]],
    linkedInUrl: ['', [Validators.maxLength(200)]],
    agenda: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
    keyWords: [[] as string[], [Validators.maxLength(20)]],
    partyIds: [[] as string[]],
  });

  ngOnInit(): void {
    this.candidateService.getMyCandidateProfile().subscribe({
      next: (profileData) => {
        // If the backend returns 204 No Content, profileData will be null
        if (profileData) {
          // They have a profile! Fill the form.
          this.candidate = profileData;
          this.profileForm.patchValue(profileData);
          this.candidacyExists.set(true);
        } else {
          // No profile yet. Leave form empty.
          this.candidacyExists.set(false);
        }

        this.pageReady.set(true);
      },
      error: (err) => {
        // Since 404s are gone, ONLY genuine errors (500 Server Error, 401 Unauthorized, etc.) end up here.
        this.errorMessage.set(this.translate.instant('CANDIDATE.CANDIDACY.MESSAGES.GENERIC_ERROR'));
        this.pageReady.set(true);
      },
    });
  }

  isFieldInvalid(fieldName: string, errorType: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!control && control.hasError(errorType) && (control.touched || control.dirty);
  }

  noChangesMade(): boolean {
    return (
      this.candidacyExists() &&
      this.profileForm.controls.firstName.value === this.candidate?.firstName &&
      this.profileForm.controls.lastName.value === this.candidate?.lastName &&
      this.profileForm.controls.bio.value === this.candidate?.bio &&
      this.profileForm.controls.linkedInUrl.value === this.candidate?.linkedInUrl &&
      this.profileForm.controls.agenda.value === this.candidate?.agenda &&
      JSON.stringify(this.profileForm.controls.keyWords.value) ===
        JSON.stringify(this.candidate?.keyWords) &&
      JSON.stringify(this.profileForm.controls.partyIds.value) ===
        JSON.stringify(this.candidate?.partyIds)
    );
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValues = this.profileForm.getRawValue();
    this.profileForm.disable();

    // Dynamically build the payload matching CandidateDto
    const request$ = this.candidacyExists()
      ? this.candidateService.updateCandidateProfile({
          ...formValues,
          id: this.candidate?.id || '', // Ensure we have an ID for updates
        })
      : this.candidateService.createCandidateProfile(formValues);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ||
            this.translate.instant('CANDIDATE.CANDIDACY.MESSAGES.GENERIC_ERROR'),
        );
        this.isLoading.set(false);
        this.profileForm.enable();
      },
    });
  }

  onDelete() {
    if (!confirm(this.translate.instant('CANDIDATE.CANDIDACY.MESSAGES.CONFIRM_DELETE'))) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.profileForm.disable();

    this.candidateService.deleteCandidateProfile().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ||
            this.translate.instant('CANDIDATE.CANDIDACY.MESSAGES.GENERIC_ERROR'),
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
