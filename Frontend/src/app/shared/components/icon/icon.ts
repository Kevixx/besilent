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

  @HostBinding('style.--icon-url')
  get iconUrl() {
    return `url('${this.src}')`;
  }

  @HostBinding('style.width')
  get iconWidth() {
    return this.size;
  }

  @HostBinding('style.height')
  get iconHeight() {
    return this.size;
  }

  // Change 'KeyboardEvent' to 'Event'
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  handleKeyboardEvent(event: Event) {
    // Only intercept if the icon is meant to be interactive (has a tabindex)
    if (this.el.nativeElement.hasAttribute('tabindex')) {
      event.preventDefault(); // Prevents the spacebar from scrolling the page down
      this.el.nativeElement.click(); // Triggers the standard (click) event on the element
    }
  }
}
