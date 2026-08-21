import { TestBed } from '@angular/core/testing'; // Removed fakeAsync and tick
import { ThemeService } from './theme.service';
import { vi } from 'vitest';
import '../../../test-setup';

describe('ThemeService', () => {
  let setAttributeSpy: any;
  let removeAttributeSpy: any;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    setAttributeSpy = vi.spyOn(document.documentElement, 'setAttribute');
    removeAttributeSpy = vi.spyOn(document.documentElement, 'removeAttribute');

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
  });

  it('should initialize with dark theme if localStorage says "dark"', () => {
    localStorage.setItem('theme', 'dark');

    const service = TestBed.inject(ThemeService);
    expect(service.isDarkTheme()).toBe(true);
  });

  it('should initialize with light theme if localStorage says "light"', () => {
    localStorage.setItem('theme', 'light');

    const service = TestBed.inject(ThemeService);
    expect(service.isDarkTheme()).toBe(false);
  });

  it('should fallback to OS dark preference if localStorage is empty', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

    const service = TestBed.inject(ThemeService);
    expect(service.isDarkTheme()).toBe(true);
  });

  it('should toggle the theme state from light to dark', () => {
    localStorage.setItem('theme', 'light');
    const service = TestBed.inject(ThemeService);

    service.toggleTheme();
    expect(service.isDarkTheme()).toBe(true);
  });

  it('should update DOM and localStorage when toggled to Dark Mode', () => {
    localStorage.setItem('theme', 'light');
    const service = TestBed.inject(ThemeService);

    service.toggleTheme();
    TestBed.tick();

    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
