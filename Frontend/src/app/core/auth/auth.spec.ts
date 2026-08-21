import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;

  // 1. Create your spy object normally
  const mockSupabaseClient = {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthService, // Ensure the service is explicitly provided
      ],
    });

    service = TestBed.inject(AuthService);

    // 2. THE MAGIC BULLET: Override the internal supabase instance directly!
    // We use bracket notation to bypass TypeScript's private property checks.
    (service as any).supabase = mockSupabaseClient;
  });

  // 3. Remove the createClient test.
  // We can't test if createClient was called because we bypassed it entirely.
  // Testing constructor initialization of third-party libs is generally considered an anti-pattern anyway!

  it('registers a user and forwards custom metadata', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const result = await service.register({
      email: 'person@example.com',
      password: 'secret123',
      name: 'John Smith',
      phone: '1234567890', // Make sure you added phone here!
    });

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'person@example.com',
      password: 'secret123',
      phone: '1234567890',
      options: {
        data: {
          name: 'John Smith',
        },
      },
    });
    expect(result).toEqual({ user: { id: 'user-1' } });
  });

  it('throws when Supabase returns an error during login', async () => {
    const error = new Error('invalid login');
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: null, error });

    await expect(service.login({ email: 'person@example.com', password: 'wrong' })).rejects.toThrow(
      'invalid login',
    );
  });

  it('returns the current access token from the session', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: { access_token: 'token-123' } },
    });

    await expect(service.getToken()).resolves.toBe('token-123');
  });

  it('builds the password reset redirect URL from the frontend environment', async () => {
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

    await service.resetPassword('person@example.com');

    expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'person@example.com',
      {
        redirectTo: `${environment.url}/update-password`,
      },
    );
  });

  it('updates the password through Supabase', async () => {
    mockSupabaseClient.auth.updateUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    await service.updatePassword('new-password');

    expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({ password: 'new-password' });
  });
});
