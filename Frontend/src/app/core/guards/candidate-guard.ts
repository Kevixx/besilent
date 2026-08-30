import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { CandidateService } from '../services/candidate/candidate.service';

export const candidateGuard: CanActivateFn = (route, state) => {
  const candidateService = inject(CandidateService);
  const router = inject(Router);

  // Return the Observable directly. Angular's Router is smart enough to wait for it.
  return candidateService.checkCandidacy().pipe(
    map((isCandidate) => {
      if (isCandidate) {
        return true; // Door is open, let them in!
      }

      // Door is locked. Reroute them to the profile creation page.
      return router.createUrlTree(['/create-profile']);
    }),
    catchError(() => {
      // If the API crashes or returns a 401/404, safely eject them to the dashboard
      return of(router.createUrlTree(['/dashboard']));
    }),
  );
};
