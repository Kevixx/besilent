import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-directory',
  standalone: true,
  templateUrl: './directory.html',
  styleUrls: ['./directory.scss'],
  imports: [TranslatePipe],
})
export class DirectoryComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }
}
