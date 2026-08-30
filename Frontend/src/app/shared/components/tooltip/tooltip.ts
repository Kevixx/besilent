import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class TooltipComponent {
  @Input({ required: true }) text: string | string[] = '';
  @Input() position: 'top' | 'bottom' = 'bottom';
  @Input() disabled: boolean = false; // Allows hiding the tooltip conditionally

  // Automatically handles both strings and arrays
  get displayText(): string {
    if (!this.text) return '';
    return Array.isArray(this.text) ? this.text.join(', ') : this.text;
  }
}
