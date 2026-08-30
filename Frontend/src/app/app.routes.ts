import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { candidateGuard } from './core/guards/candidate-guard';
import { UpdatePasswordComponent } from './features/access/update-password/update-password';
import { ForgotPasswordComponent } from './features/access/forgot-password/forgot-password';
import { MainLayoutComponent } from './shared/components/main-layout-component/main-layout-component';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Unauthenticated routes (NO NAVBAR)
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

  // Authenticated routes (WITH NAVBAR)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Guarding the parent automatically protects ALL children!
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'create-profile',
        loadComponent: () =>
          import('./features/candidate/create-profile/create-profile').then(
            (m) => m.CreateProfileComponent,
          ),
      },
      {
        path: 'create-party',
        loadComponent: () =>
          import('./features/party/create-party/create-party').then((m) => m.CreatePartyComponent),
        canActivate: [candidateGuard],
      },
      {
        path: 'create-election',
        loadComponent: () =>
          import('./features/election/create-election/create-election').then(
            (m) => m.CreateElectionComponent,
          ),
      },
    ],
  },

  // Wildcard Catch-All (ALWAYS AT THE BOTTOM)
  { path: '**', redirectTo: '/dashboard' },
];
