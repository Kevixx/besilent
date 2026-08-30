import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PartyService } from '../../../core/services/party/party.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-create-party',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, IconComponent],
  templateUrl: './create-party.html',
  styleUrls: ['./create-party.scss'],
})
export class CreatePartyComponent implements AfterViewInit {
  pageReady = signal(false);

  ngAfterViewInit(): void {
    this.pageReady.set(true);
  }
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private partyService = inject(PartyService);
  private translate = inject(TranslateService);

  isLoading = signal(false);
  errorMessage = signal('');

  partyForm = this.fb.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(500),
    ]),
  });

  onSubmit() {
    if (this.partyForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = this.partyForm.getRawValue();
    this.partyForm.disable();

    this.partyService.createParty(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Redirect to dashboard (or wherever you want them to go)
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // If they get a 403 Forbidden, this will display the error message from C#
        this.errorMessage.set(
          err.error?.message || this.translate.instant('PARTY.CREATE_PARTY.ERROR_MESSAGE'),
        );
        this.isLoading.set(false);
        this.partyForm.enable();
      },
    });
  }

  onClose() {
    this.router.navigate(['/dashboard']);
  }
}
