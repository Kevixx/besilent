import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './core/auth/auth';
import { from, switchMap } from 'rxjs';

/**
 * An HTTP Interceptor is instead of manually remembering to attach the token every time
 * you write a new API call, the interceptor sits transparently in the background, catches
 * every outgoing request, stamps it with the Supabase JWT, and sends it on its way.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Convert the async getToken() Promise into an Observable
  return from(authService.getToken()).pipe(
    switchMap((token) => {
      // If we have a token, clone the request and attach the Authorization header
      if (token) {
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Send the modified request to the C# backend
        return next(clonedRequest);
      }

      // If there is no token (e.g., user is not logged in), send the original request
      return next(req);
    }),
  );
};
