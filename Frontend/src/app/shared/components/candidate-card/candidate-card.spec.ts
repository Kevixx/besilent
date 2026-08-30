import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CandidateCardComponent } from './candidate-card';
import { CandidateDto } from '../../dtos/candidacy-dto';

describe('CandidateCard', () => {
  let component: CandidateCardComponent;
  let fixture: ComponentFixture<CandidateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCardComponent],
      providers: [
        provideRouter([]), // Required for the RouterLink in the HTML
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCardComponent);
    component = fixture.componentInstance;

    // Provide a dummy candidate so the HTML doesn't crash looking for firstName
    const mockCandidate: CandidateDto = {
      id: '123',
      firstName: 'Test',
      lastName: 'Candidate',
      agenda: 'Test Agenda',
      bio: 'Test Bio',
      keyWords: [],
      partyIds: [],
    };

    fixture.componentRef.setInput('candidate', mockCandidate);

    // We must call detectChanges AFTER setting the input so the view renders safely
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // This is the block that was missing!
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
