import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateListComponent } from './candidate-list';
// Add this import
import { provideTranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Needed if CandidateService uses HTTP

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateListComponent, HttpClientTestingModule],
      providers: [
        provideTranslateService(), // <-- ADD THIS
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
