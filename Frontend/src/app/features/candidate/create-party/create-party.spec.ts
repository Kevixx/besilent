import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePartyComponent } from './create-party';
import { PartyService } from '../../../core/services/party'; // Adjust path if needed
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('CreatePartyComponent', () => {
  let component: CreatePartyComponent;
  let fixture: ComponentFixture<CreatePartyComponent>;

  let mockPartyService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockPartyService = {
      createParty: vi.fn(),
    };
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreatePartyComponent],
      providers: [
        { provide: PartyService, useValue: mockPartyService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
        provideTranslateService(), // Native support for TranslatePipe
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePartyComponent);
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

  it('should NOT submit if the form is invalid (name or description too short)', () => {
    component.partyForm.controls.name.setValue('A'); // Too short
    component.partyForm.controls.description.setValue('Too short description'); // < 20 chars

    component.onSubmit();

    expect(component.partyForm.invalid).toBeTruthy();
    expect(mockPartyService.createParty).not.toHaveBeenCalled();
  });

  it('should submit, navigate to dashboard, and stop loading on success', () => {
    const validData = {
      name: 'The Forward Coalition',
      description:
        'This is a beautifully long description that meets the 20 character requirement.',
    };
    component.partyForm.setValue(validData);

    mockPartyService.createParty.mockReturnValue(of({}));

    component.onSubmit();

    expect(component.isLoading()).toBeFalsy();
    expect(mockPartyService.createParty).toHaveBeenCalledWith(validData);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle errors, set errorMessage, and re-enable form on failure', () => {
    const validData = {
      name: 'The Forward Coalition',
      description:
        'This is a beautifully long description that meets the 20 character requirement.',
    };
    component.partyForm.setValue(validData);

    const mockError = { error: { message: 'You already founded a party!' } };
    mockPartyService.createParty.mockReturnValue(throwError(() => mockError));

    component.onSubmit();

    expect(component.errorMessage()).toBe('You already founded a party!');
    expect(component.isLoading()).toBeFalsy();
    expect(component.partyForm.enabled).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
