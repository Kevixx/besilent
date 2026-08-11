import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth';
import { UpdatePasswordComponent } from './update-password';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let authService: {
    updatePassword: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>; // <-- Add this line
  };
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let translateService: {
    instant: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = {
      updatePassword: vi.fn(),
      logout: vi.fn().mockResolvedValue(undefined),
    };
    router = {
      navigate: vi.fn(),
    };
    translateService = {
      instant: vi.fn((key: string) => key),
    };

    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateService },
        { provide: ActivatedRoute, useValue: { fragment: of('') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('shows an error message when the password reset fragment contains an error', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateService },
        {
          provide: ActivatedRoute,
          useValue: { fragment: of('error=access_denied&error_description=Link+expired') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.hasError).toBe(true);
    expect(component.error()).toBe('Link expired');
  });

  it('updates the password and redirects back to login', async () => {
    authService.updatePassword.mockResolvedValue(undefined);

    const setTimeoutSpy = vi.spyOn(window, 'setTimeout').mockImplementation(((
      handler: TimerHandler,
    ) => {
      if (typeof handler === 'function') {
        handler();
      }

      return 0 as any;
    }) as typeof setTimeout);

    component.newPassword = 'new-password';
    component.repeatPassword = 'new-password';

    await component.onSubmit();

    expect(authService.updatePassword).toHaveBeenCalledWith('new-password');
    expect(translateService.instant).toHaveBeenCalledWith(
      'ACCESS.UPDATE_PASSWORD.MESSAGES.SUCCESS',
    );
    expect(component.message()).toBe('ACCESS.UPDATE_PASSWORD.MESSAGES.SUCCESS');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

    setTimeoutSpy.mockRestore();
  });

  it('surfaces password update errors from the auth service', async () => {
    authService.updatePassword.mockRejectedValue(new Error('update failed'));

    component.newPassword = 'new-password';
    component.repeatPassword = 'new-password';

    await component.onSubmit();

    expect(component.error()).toBe('update failed');
    expect(component.message()).toBe('');
  });
});
