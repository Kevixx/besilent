import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkTheme = signal<boolean>(false);

  // Inject the platform ID to check if we are in the browser or on the server
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Only read from the browser if we are actually IN the browser
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.isDarkTheme.set(true);
      }
    }

    // Automatically apply the CSS and save to storage when the signal changes
    effect(() => {
      const isDark = this.isDarkTheme();

      if (isPlatformBrowser(this.platformId)) {
        if (isDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        }
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme.update((dark) => !dark);
  }
}
