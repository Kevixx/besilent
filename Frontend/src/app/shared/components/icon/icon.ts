import { Component, Input, HostBinding, HostListener, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.html',
  styleUrls: ['./icon.scss'],
})
export class IconComponent {
  private el = inject(ElementRef);

  @Input({ required: true }) src!: string;
  @Input() size = '24px';

  // Make these optional, so we know if the user explicitly set them
  @Input() height?: string;
  @Input() width?: string;

  @HostBinding('style.--icon-url')
  get iconUrl() {
    return `url('${this.src}')`;
  }

  @HostBinding('style.width')
  get iconWidth() {
    // If width was provided, use it. Otherwise, fall back to size.
    return this.width || this.size;
  }

  @HostBinding('style.height')
  get iconHeight() {
    // If height was provided, use it. Otherwise, fall back to size.
    return this.height || this.size;
  }
}
