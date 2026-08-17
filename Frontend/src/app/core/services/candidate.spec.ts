import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CandidateService } from './candidate';
import { environment } from '../../../environments/environment.development';
import { CreateProfileDto } from '../../shared/dtos/create-profile-dto';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // Provides the mock HTTP backend
      ],
    });
    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no outstanding requests after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create a profile', () => {
    // Arrange
    const mockDto: CreateProfileDto = { bio: 'This is a test bio.', partyId: null };
    const mockResponse = { id: '123', message: 'Profile created' };
    const expectedUrl = `${environment.apiUrl}/candidate`;

    // Act
    service.createProfile(mockDto).subscribe((res) => {
      // Assert the response matches what the mock backend returns
      expect(res).toEqual(mockResponse);
    });

    // Assert the HTTP call
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDto);

    // Resolve the request with the mock response
    req.flush(mockResponse);
  });
});
