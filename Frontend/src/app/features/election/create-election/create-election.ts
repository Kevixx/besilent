import { AfterViewInit, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ElectionService } from '../../../core/services/election/election.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconComponent } from '../../../shared/components/icon/icon';

// Custom validator to check that End Date is after Start Date
function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;

  if (start && end && new Date(start) >= new Date(end)) {
    return { dateRangeInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-create-election',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, IconComponent],
  templateUrl: './create-election.html',
  styleUrls: ['./create-election.scss'],
})
export class CreateElectionComponent implements AfterViewInit {
  pageReady = signal(false);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private electionService = inject(ElectionService);
  private translate = inject(TranslateService);

  isLoading = signal(false);
  errorMessage = signal('');

  // Attach the custom dateRangeValidator to the group level
  electionForm = this.fb.group(
    {
      title: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      description: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500),
      ]),
      startDate: this.fb.nonNullable.control('', [Validators.required]),
      endDate: this.fb.nonNullable.control('', [Validators.required]),
    },
    { validators: dateRangeValidator },
  );

  ngAfterViewInit(): void {
    this.pageReady.set(true);
  }

  onSubmit() {
    if (this.electionForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = this.electionForm.getRawValue();
    this.electionForm.disable();

    this.electionService.createElection(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Displays backend validation errors (like "Cannot schedule in the past")
        this.errorMessage.set(
          err.error?.message ||
            this.translate.instant('ELECTION.CREATE_ELECTION.MESSAGES.ERROR_GENERIC'),
        );
        this.isLoading.set(false);
        this.electionForm.enable();
      },
    });
  }

  onClose() {
    this.router.navigate(['/dashboard']);
  }
}
