import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CandidateService } from '../../core/services/candidate/candidate.service';
import { CandidateListComponent } from '../candidate/candidate-list/candidate-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CandidateListComponent],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Inject the service you built!
  private candidateService = inject(CandidateService);

  isCandidate = signal(false);
  isLoading = signal(true);

  ngOnInit() {
    this.checkCandidateStatus();
  }

  checkCandidateStatus() {
    this.candidateService.checkCandidacy().subscribe({
      next: (status: boolean) => {
        this.isCandidate.set(status);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to check candidacy status:', err);
        this.isLoading.set(false);
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
