import { TestBed } from '@angular/core/testing';
import { createClient } from '@supabase/supabase-js';

import { AuthService } from './auth';
import { environment } from '../../../environments/environment';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

describe('AuthService', () => {
  const mockSupabase = {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  };

  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('creates the Supabase client with environment settings', () => {
    expect(createClient).toHaveBeenCalledWith(environment.supabaseUrl, environment.supabaseKey);
  });

  it('registers a user and forwards custom metadata', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });

    const result = await service.register({
      email: 'person@example.com',
      password: 'secret123',
      role: 2,
    });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'person@example.com',
      password: 'secret123',
      options: {
        data: {
          global_role: 2,
        },
      },
    });
    expect(result).toEqual({ user: { id: 'user-1' } });
  });

  it('throws when Supabase returns an error during login', async () => {
    const error = new Error('invalid login');
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: null, error });

    await expect(service.login({ email: 'person@example.com', password: 'wrong' })).rejects.toThrow(
      'invalid login',
    );
  });

  it('returns the current access token from the session', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { access_token: 'token-123' } },
    });

    await expect(service.getToken()).resolves.toBe('token-123');
  });

  it('builds the password reset redirect URL from the frontend environment', async () => {
    mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

    await service.resetPassword('person@example.com');

    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('person@example.com', {
      redirectTo: `${environment.url}/update-password`,
    });
  });

  it('updates the password through Supabase', async () => {
    mockSupabase.auth.updateUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    await service.updatePassword('new-password');

    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({ password: 'new-password' });
  });
});
