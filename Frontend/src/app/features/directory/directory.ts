import { Component } from '@angular/core';

@Component({
  selector: 'app-directory',
  standalone: true,
  templateUrl: './directory.html',
  styleUrls: ['./directory.scss'],
  imports: [],
})
export class DirectoryComponent {
  logout() {
    window.location.href = '/login';
  }

  dashboard() {
    window.location.href = '/dashboard';
  }
}
