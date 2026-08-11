import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { DashboardComponent } from './dashboard';
import { environment } from '../../../../environments/environment';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: {
    get: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    httpClient = {
      get: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: HttpClient, useValue: httpClient }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('calls the protected API with the expected endpoint', () => {
    const subscribe = vi.fn();
    httpClient.get.mockReturnValue({ subscribe });

    component.testSecureEndpoint();

    expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/user/me`);
    expect(subscribe).toHaveBeenCalledWith({
      next: expect.any(Function),
      error: expect.any(Function),
    });
  });
});
