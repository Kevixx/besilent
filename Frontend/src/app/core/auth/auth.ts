import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  // Register a new user directly with Supabase
  register(credentials: { email: string; password: string; role?: number }): Observable<any> {
    return from(
      this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            global_role: credentials.role, // Save the role into Supabase's custom user metadata
          },
        },
      }),
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
    );
  }

  // Log in directly with Supabase
  login(credentials: { email: string; password: string }): Observable<any> {
    return from(
      this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      }),
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;
        return response.data;
      }),
    );
  }

  // Helper to get the current session token (to send to your C# API later)
  async getToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token || null;
  }
}
