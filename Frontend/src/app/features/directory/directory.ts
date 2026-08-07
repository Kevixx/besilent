import { Component } from '@angular/core';

@Component({
  selector: 'app-directory',
  standalone: true,
  template: `
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
      <h1>Workspace Directory</h1>
      <p>Authentication Successful! You are securely logged in.</p>
      <button style="margin: 1rem; padding: 0.5rem 1rem; font-size: 1rem;" (click)="logout()">Logout</button>
    </div>
    
  `
})
export class DirectoryComponent {

  logout() {
    window.location.href = '/login';
  }
}