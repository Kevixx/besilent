import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [],
})
export class DashboardComponent {
  private http = inject(HttpClient);

  testSecureEndpoint() {
    const backendUrl = environment.apiUrl;

    this.http.get(backendUrl + '/user/me').subscribe({
      next: (response) => {
        console.log('🎉 Success! The C# API accepted our token:', response);
      },
      error: (error) => {
        console.error('🚫 Access Denied! C# rejected the request:', error);
      },
    });
  }

  logout() {
    window.location.href = '/login';
  }

  directory() {
    window.location.href = '/directory';
  }
}
