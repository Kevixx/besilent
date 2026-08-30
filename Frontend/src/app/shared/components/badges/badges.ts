import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  NgZone,
  signal,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { TooltipComponent } from '../tooltip/tooltip';

@Component({
  selector: 'app-badges',
  imports: [SlicePipe, TooltipComponent],
  templateUrl: './badges.html',
  styleUrl: './badges.scss',
})
export class BadgesComponent implements AfterViewInit, OnDestroy {
  @Input() keywords: string[] | undefined = [];

  dynamicCount = signal(0);

  // Grab the hidden measuring tape element from the DOM
  @ViewChild('measuringTape') measuringTape?: ElementRef<HTMLDivElement>;

  private el = inject(ElementRef);
  private ngZone = inject(NgZone);
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    if (!this.keywords || this.keywords.length === 0) return;

    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (!this.measuringTape) return;

        const containerWidth = entries[0].contentRect.width;
        const tapeEl = this.measuringTape.nativeElement;

        const badges = Array.from(tapeEl.querySelectorAll('.measure-badge')) as HTMLElement[];
        const extraBadge = tapeEl.querySelector('.measure-extra') as HTMLElement;

        if (!badges.length || !extraBadge) return;

        // 1. Get the total width if we rendered EVERY badge
        const lastBadge = badges[badges.length - 1];
        const totalWidth = lastBadge.offsetLeft + lastBadge.offsetWidth;

        let count = this.keywords!.length;

        // 2. If they don't all fit, calculate how many do fit ALONG with the +X badge
        if (totalWidth > containerWidth) {
          const extraWidth = extraBadge.offsetWidth;
          const gap = parseFloat(getComputedStyle(tapeEl).gap) || 4; // Fallback to 4px

          const availableWidth = containerWidth - extraWidth - gap;

          count = 0;
          for (let i = 0; i < badges.length; i++) {
            // offsetLeft + offsetWidth gives us the exact pixel position of the end of the badge!
            const badgeEnd = badges[i].offsetLeft + badges[i].offsetWidth;

            if (badgeEnd <= availableWidth) {
              count = i + 1;
            } else {
              break; // The moment a badge crosses the limit, stop counting
            }
          }
        }

        if (this.dynamicCount() !== count) {
          this.ngZone.run(() => {
            this.dynamicCount.set(count);
          });
        }
      });

      const parentElement = this.el.nativeElement.parentElement;
      if (parentElement) {
        this.resizeObserver.observe(parentElement);
      }
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
