import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [NavbarComponent],
})
export class DashboardComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

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

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
