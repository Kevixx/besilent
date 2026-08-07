import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './core/auth/auth';

/**
 * Guards routes that require authentication by checking for an active Supabase session.
 *
 * An Angular Auth Guard acts as a security checkpoint that runs before a user is allowed
 * to access a specific route. The CanActivate guard determines whether a user can access
 * a route and is most commonly used for authentication and authorization.
 *
 * By connecting this guard directly to your Supabase session, anyone who tries to visit your internal
 * workspace without a valid token will be instantly redirected back to the login screen.
 *
 * $ ng generate guard auth
 * ✔ Which type of guard would you like to create? CanActivate
 */

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Ask Supabase if there is a currently active session
  const token = await authService.getToken();

  if (token) {
    return true; // The user is logged in, allow them to view the page
  }

  // The user is not logged in, boot them back to the login screen
  return router.createUrlTree(['/login']);
};
