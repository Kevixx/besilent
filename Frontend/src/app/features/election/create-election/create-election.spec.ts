import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateElectionComponent } from './create-election';
import { ElectionService } from '../../../core/services/election/election.service';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('CreateElectionComponent', () => {
  let component: CreateElectionComponent;
  let fixture: ComponentFixture<CreateElectionComponent>;

  let mockElectionService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockElectionService = {
      createElection: vi.fn(),
    };
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateElectionComponent],
      providers: [
        { provide: ElectionService, useValue: mockElectionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
        provideTranslateService(), // Native support for TranslatePipe
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateElectionComponent);
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

  it('should navigate to dashboard on close', () => {
    component.onClose();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should NOT submit if the form is invalid (missing required fields)', () => {
    // Act
    component.onSubmit(); // Form is empty by default

    // Assert
    expect(component.electionForm.invalid).toBeTruthy();
    expect(mockElectionService.createElection).not.toHaveBeenCalled();
  });

  it('should invalidate the form if the End Date is before the Start Date', () => {
    // Arrange
    component.electionForm.patchValue({
      title: 'Valid Title Here',
      description: 'This is a perfectly valid description over 20 characters.',
      startDate: '2026-10-15T12:00',
      endDate: '2026-10-10T12:00', // End date is BEFORE start date
    });

    // Act
    component.onSubmit();

    // Assert
    expect(component.electionForm.hasError('dateRangeInvalid')).toBeTruthy();
    expect(component.electionForm.invalid).toBeTruthy();
    expect(mockElectionService.createElection).not.toHaveBeenCalled();
  });

  it('should submit, navigate to dashboard, and stop loading on success', () => {
    // Arrange
    const validData = {
      title: 'Valid Title Here',
      description: 'This is a perfectly valid description over 20 characters.',
      startDate: '2026-10-10T12:00',
      endDate: '2026-10-15T12:00', // End date is AFTER start date (Valid)
    };
    component.electionForm.setValue(validData);

    mockElectionService.createElection.mockReturnValue(of({}));

    // Act
    component.onSubmit();

    // Assert
    expect(component.isLoading()).toBeFalsy();
    expect(mockElectionService.createElection).toHaveBeenCalledWith(validData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle errors, set errorMessage, and re-enable form on failure', () => {
    // Arrange
    const validData = {
      title: 'Valid Title Here',
      description: 'This is a perfectly valid description over 20 characters.',
      startDate: '2026-10-10T12:00',
      endDate: '2026-10-15T12:00',
    };
    component.electionForm.setValue(validData);

    const mockError = { error: { message: 'Elections cannot be scheduled in the past.' } };
    mockElectionService.createElection.mockReturnValue(throwError(() => mockError));

    // Act
    component.onSubmit();

    // Assert
    expect(component.errorMessage()).toBe('Elections cannot be scheduled in the past.');
    expect(component.isLoading()).toBeFalsy();
    expect(component.electionForm.enabled).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
