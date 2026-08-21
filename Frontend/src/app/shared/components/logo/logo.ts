import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-logo',
  imports: [IconComponent],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class LogoComponent {
  @Input() height: string = 'var(--logo-height)';
}
