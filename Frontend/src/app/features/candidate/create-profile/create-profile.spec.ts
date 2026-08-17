import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProfileComponent } from './create-profile';
import { CandidateService } from '../../../core/services/candidate';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  let mockCandidateService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCandidateService = {
      createProfile: vi.fn(),
    };
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      // We just import the component (which already brings in TranslatePipe!)
      imports: [CreateProfileComponent],
      providers: [
        { provide: CandidateService, useValue: mockCandidateService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },

        // THE FIX: Provide the REAL translation service so the Pipe works natively!
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageReady to true after view init', () => {
    component.ngAfterViewInit();
    expect(component.pageReady()).toBeTruthy();
  });

  it('should NOT submit if the form is invalid (bio too short)', () => {
    component.profileForm.controls.bio.setValue('Too short');
    component.onSubmit();

    expect(component.profileForm.invalid).toBeTruthy();
    expect(mockCandidateService.createProfile).not.toHaveBeenCalled();
  });

  it('should submit, navigate to dashboard, and stop loading on success', () => {
    const validBio = 'This is a perfectly valid bio that is over 20 characters long.';
    component.profileForm.controls.bio.setValue(validBio);

    mockCandidateService.createProfile.mockReturnValue(of({}));

    component.onSubmit();

    expect(component.isLoading()).toBeFalsy();
    expect(mockCandidateService.createProfile).toHaveBeenCalledWith({
      bio: validBio,
      partyId: null,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle errors, set errorMessage, and re-enable form on failure', () => {
    const validBio = 'This is a perfectly valid bio that is over 20 characters long.';
    component.profileForm.controls.bio.setValue(validBio);

    const mockError = { error: { message: 'Profile already exists' } };
    mockCandidateService.createProfile.mockReturnValue(throwError(() => mockError));

    component.onSubmit();

    expect(component.errorMessage()).toBe('Profile already exists');
    expect(component.isLoading()).toBeFalsy();
    expect(component.profileForm.enabled).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
