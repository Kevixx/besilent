import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-directory',
  standalone: true,
  templateUrl: './directory.html',
  styleUrls: ['./directory.scss'],
  imports: [TranslatePipe],
})
export class DirectoryComponent {
  logout() {
    window.location.href = '/login';
  }

  dashboard() {
    window.location.href = '/dashboard';
  }
}
