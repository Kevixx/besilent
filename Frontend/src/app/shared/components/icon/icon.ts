import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.html',
  styleUrls: ['./icon.scss'],
})
export class IconComponent {
  // Pass the path to the SVG file (e.g., 'assets/icons/logout.svg')
  @Input({ required: true }) src!: string;

  // Optional size (defaults to 24px)
  @Input() size = '24px';

  // Dynamically creates a CSS variable based on the name input
  @HostBinding('style.--icon-url')
  get iconUrl() {
    return `url('${this.src}')`;
  }

  // Binds the size input to the component's CSS width
  @HostBinding('style.width')
  get iconWidth() {
    return this.size;
  }

  // Binds the size input to the component's CSS height
  @HostBinding('style.height')
  get iconHeight() {
    return this.size;
  }
}
