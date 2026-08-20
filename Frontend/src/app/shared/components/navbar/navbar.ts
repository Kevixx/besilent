import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon';
import { CandidateService } from '../../../core/services/candidate';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, IconComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  pageReady = signal(false);
  isCandidate = signal(false);

  ngAfterViewInit(): void {
    this.pageReady.set(true);
  }
  ngOnInit(): void {
    this.hasCandidacy();
  }

  isMenuOpen = signal(false);
  candidateId = signal<string | null>(null);

  private router = inject(Router);
  private authService = inject(AuthService);
  private candidateService = inject(CandidateService);

  toggleMenu() {
    this.isMenuOpen.update((state) => !state);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async hasCandidacy(): Promise<boolean> {
    try {
      this.isCandidate.set(await firstValueFrom(this.candidateService.getCandidateId()));
      return this.isCandidate();
    } catch (error) {
      console.error('Failed to check candidate ID:', error);
      return false;
    }
  }
}
