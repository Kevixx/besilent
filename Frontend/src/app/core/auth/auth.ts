import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Singleton injection
})
export class AuthService {
  private http = inject(HttpClient);

  // Default .NET local HTTP port
  private apiUrl = 'http://localhost:5030/api/auth'; 

  login(credentials: any) {
    console.log('Attempting to log in with credentials:', credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}