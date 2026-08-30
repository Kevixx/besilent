import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProfileComponent } from './create-profile';
import { CandidateService } from '../../../core/services/candidate/candidate.service';
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
      createCandidateProfile: vi.fn(),
      getProfile: vi.fn().mockReturnValue(of({})),
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
    // Fill out the required fields so the ONLY invalid thing is the bio
    component.profileForm.patchValue({
      firstName: 'Kevin',
      lastName: 'LastName',
      agenda: 'This is a valid agenda over 20 chars',
      bio: 'Too short',
    });

    component.onSubmit();

    expect(component.profileForm.invalid).toBeTruthy();
    expect(mockCandidateService.createCandidateProfile).not.toHaveBeenCalled();
  });

  it('should submit, navigate to dashboard, and stop loading on success', () => {
    // 2. Provide a completely valid form object
    const validData = {
      firstName: 'Kevin',
      lastName: 'LastName',
      bio: 'This is a perfectly valid bio that is over 20 characters long.',
      linkedInUrl: '',
      agenda: 'This is a perfectly valid agenda over 20 chars',
      keyWords: [],
      partyIds: [],
    };

    component.profileForm.setValue(validData);
    mockCandidateService.createCandidateProfile.mockReturnValue(of({}));

    component.onSubmit();

    expect(component.isLoading()).toBeFalsy();
    // Expect it to be called with the full valid object
    expect(mockCandidateService.createCandidateProfile).toHaveBeenCalledWith(validData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle errors, set errorMessage, and re-enable form on failure', () => {
    // Make the form valid so it actually reaches the service layer
    component.profileForm.patchValue({
      firstName: 'Kevin',
      lastName: 'LastName',
      bio: 'This is a perfectly valid bio that is over 20 characters long.',
      agenda: 'This is a perfectly valid agenda over 20 chars',
    });

    const mockError = { error: { message: 'Profile already exists' } };
    mockCandidateService.createCandidateProfile.mockReturnValue(throwError(() => mockError));

    component.onSubmit();

    expect(component.errorMessage()).toBe('Profile already exists');
    expect(component.isLoading()).toBeFalsy();
    expect(component.profileForm.enabled).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
