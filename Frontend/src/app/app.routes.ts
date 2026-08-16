import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { UpdatePasswordComponent } from './features/access/update-password/update-password';
import { ForgotPasswordComponent } from './features/access/forgot-password/forgot-password';

export const routes: Routes = [
  // The single, clean root redirect (using an absolute path with the leading slash)
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/access/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent,
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'directory',
    loadComponent: () => import('./features/directory/directory').then((m) => m.DirectoryComponent),
    canActivate: [authGuard],
  },

  // If a user types localhost:4200/nonsense, it sends them here.
  // ALWAYS keep this at the absolute bottom of the array!
  { path: '**', redirectTo: '/login' },
];
