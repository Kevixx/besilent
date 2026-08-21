import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PartyService } from './party.service';
import { environment } from '../../../environments/environment';

describe('PartyService', () => {
  let service: PartyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PartyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifies that no requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create a party', () => {
    // Arrange
    const mockDto = {
      name: 'Forward Party',
      description: 'This is a valid twenty character description.',
    };
    const mockResponse = { id: '123-abc', message: 'Party successfully created' };
    const expectedUrl = `${environment.apiUrl}/party`;

    // Act
    service.createParty(mockDto).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDto);

    // Resolve
    req.flush(mockResponse);
  });
});
