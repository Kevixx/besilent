import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root', // Singleton injection
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: any) {
    console.log('Attempting to log in with credentials:', credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any) {
    console.log('Attempting to register with user data:', userData);
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
