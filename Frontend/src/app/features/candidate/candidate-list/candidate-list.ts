import { Component, inject, OnInit, signal } from '@angular/core';
import { CandidateService } from '../../../core/services/candidate/candidate.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfileDto } from '../../../shared/dtos/profile-dto';

import { BadgesComponent } from '../../../shared/components/badges/badges';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [TranslatePipe, BadgesComponent, TooltipComponent],
  templateUrl: './candidate-list.html',
  styleUrls: ['./candidate-list.scss'],
})
export class CandidateListComponent implements OnInit {
  private candidateService = inject(CandidateService);

  candidates = signal<ProfileDto[]>([]);
  isLoading = signal(true);
  selectedCandidate = signal<ProfileDto | null>(null);

  mockKeywords = ['Education', 'Healthcare', 'Environment', 'Economy', 'Technology'];

  ngOnInit() {
    this.fetchCandidates();
  }

  fetchCandidates() {
    this.isLoading.set(true);

    this.candidateService.getAllCandidates().subscribe({
      next: (data: ProfileDto[]) => {
        this.candidates.set(data);
        this.candidates().forEach((candidate) => {
          if (!candidate.keyWords || candidate.keyWords.length === 0) {
            candidate.keyWords = this.mockKeywords;
          }
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  openCandidate(candidateId: string) {
    // Navigate to the candidate's detail page
    window.location.href = `/candidates/${candidateId}`;
    this.selectedCandidate.set(this.candidates().find((c) => c.id === candidateId) || null);
  }

  closeCandidate() {
    this.selectedCandidate.set(null);
  }
}
