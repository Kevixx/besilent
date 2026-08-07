import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Lazy load the login component
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.LoginComponent)
  },

  {
    path: 'directory',
    loadComponent: () => import('./features/directory/directory').then(m => m.DirectoryComponent)
  }
];