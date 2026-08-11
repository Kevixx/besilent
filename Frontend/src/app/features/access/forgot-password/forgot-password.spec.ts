import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/auth/auth';
import { ForgotPasswordComponent } from './forgot-password';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: {
    resetPassword: ReturnType<typeof vi.fn>;
  };
  let translateService: {
    instant: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      resetPassword: vi.fn(),
    };
    translateService = {
      instant: vi.fn((key: string) => key),
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: TranslateService, useValue: translateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('requests a password reset and shows a success message', async () => {
    authService.resetPassword.mockResolvedValue(undefined);

    component.email = 'person@example.com';

    await component.onSubmit();

    expect(authService.resetPassword).toHaveBeenCalledWith('person@example.com');
    expect(translateService.instant).toHaveBeenCalledWith(
      'ACCESS.FORGOT_PASSWORD.MESSAGES.SUCCESS',
    );
    expect(component.message()).toBe('ACCESS.FORGOT_PASSWORD.MESSAGES.SUCCESS');
    expect(component.error()).toBe('');
  });

  it('surfaces reset errors from the auth service', async () => {
    authService.resetPassword.mockRejectedValue(new Error('reset failed'));

    component.email = 'person@example.com';

    await component.onSubmit();

    expect(component.error()).toBe('reset failed');
    expect(component.message()).toBe('');
  });
});
