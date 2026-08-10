import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  private supabaseUrl = environment.supabaseUrl;
  private supabaseKey = environment.supabaseKey;
  private frontendUrl = environment.url;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  // Register a new user directly with Supabase
  async register(credentials: { email: string; password: string; role?: number }) {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          global_role: credentials.role, // Save the role into Supabase's custom user metadata
        },
      },
    });

    // Manually throw the error so the component's try/catch can intercept it
    if (error) throw error;
    return data;
  }

  // Log in directly with Supabase
  async login(credentials: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    // Manually throw the error so the component's try/catch can intercept it
    if (error) throw error;
    return data;
  }

  // Helper to get the current session token (to send to your C# API later)
  async getToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  // Sends the reset email
  async resetPassword(email: string) {
    const redirectUrl = `${this.frontendUrl}/update-password`;

    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw error;
    return data;
  }

  // Saves the new password (called after they click the email link)
  async updatePassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  }
}
