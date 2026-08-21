import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ElectionService } from './election.service';
import { environment } from '../../../environments/environment';

describe('ElectionService', () => {
  let service: ElectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ElectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifies that no requests are outstanding after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create an election', () => {
    // Arrange
    const mockDto = {
      title: '2026 General Election',
      description: 'This is a valid twenty character description.',
      startDate: '2026-09-01T08:00',
      endDate: '2026-09-02T20:00',
    };
    const mockResponse = { id: '123-abc', message: 'Election successfully created' };
    const expectedUrl = `${environment.apiUrl}/election`;

    // Act
    service.createElection(mockDto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDto);

    // Resolve the request
    req.flush(mockResponse);
  });
});
