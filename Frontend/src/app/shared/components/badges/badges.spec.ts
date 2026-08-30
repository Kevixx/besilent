import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgesComponent } from './badges';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('BadgesComponent', () => {
  let component: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;

  // Variables to capture and mock the ResizeObserver
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;
  let resizeCallback: ResizeObserverCallback;

  beforeEach(async () => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

    globalThis.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        resizeCallback = cb;
      }
      observe = observeSpy;
      disconnect = disconnectSpy;
      unobserve = vi.fn();
    } as any;

    await TestBed.configureTestingModule({
      imports: [BadgesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the fallback character (—) if keywords are empty', () => {
    fixture.componentRef.setInput('keywords', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('—');
    expect(observeSpy).not.toHaveBeenCalled(); // No need to observe if there's nothing to render
  });

  it('should initialize ResizeObserver if keywords exist', () => {
    fixture.componentRef.setInput('keywords', ['Education', 'Healthcare']);
    fixture.detectChanges(); // Triggers ngAfterViewInit

    expect(observeSpy).toHaveBeenCalled();
  });

  it('should disconnect ResizeObserver on destroy to prevent memory leaks', () => {
    fixture.componentRef.setInput('keywords', ['Education']);
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  describe('Dynamic Calculation Logic', () => {
    it('should set dynamicCount to total keywords if they all fit in the container', () => {
      fixture.componentRef.setInput('keywords', ['One', 'Two']);
      fixture.detectChanges();

      const tape = component.measuringTape!.nativeElement;
      const badges = tape.querySelectorAll('.measure-badge');

      // Mock DOM widths: 2 badges, 50px each. Total width = 100px.
      Object.defineProperty(badges[1], 'offsetWidth', { value: 50 });
      Object.defineProperty(badges[1], 'offsetLeft', { value: 50 });

      // Trigger the resize callback with a container width of 500px (Plenty of room!)
      resizeCallback([{ contentRect: { width: 500 } }] as any, null as any);

      expect(component.dynamicCount()).toBe(2);
    });

    it('should calculate exactly how many fit and subtract the +X badge space when overflowing', () => {
      fixture.componentRef.setInput('keywords', ['One', 'Two', 'Three']);
      fixture.detectChanges();

      const tape = component.measuringTape!.nativeElement;
      const badges = tape.querySelectorAll('.measure-badge');
      const extraBadge = tape.querySelector('.measure-extra');

      // Mock DOM Layout: 3 Badges, each 50px wide.
      // Badge 1 ends at 50px
      Object.defineProperty(badges[0], 'offsetWidth', { value: 50 });
      Object.defineProperty(badges[0], 'offsetLeft', { value: 0 });

      // Badge 2 ends at 100px
      Object.defineProperty(badges[1], 'offsetWidth', { value: 50 });
      Object.defineProperty(badges[1], 'offsetLeft', { value: 50 });

      // Badge 3 ends at 150px
      Object.defineProperty(badges[2], 'offsetWidth', { value: 50 });
      Object.defineProperty(badges[2], 'offsetLeft', { value: 100 });

      // Mock the "+3" extra badge width
      Object.defineProperty(extraBadge, 'offsetWidth', { value: 30 });

      // Trigger the resize callback with a container width of 100px.
      // The total width (150px) is > container (100px), so it recalculates.
      // Available Space = 100(container) - 30(extra) - 4(gap) = 66px.
      // Badge 1 ends at 50px (FITS!). Badge 2 ends at 100px (DOES NOT FIT!).
      resizeCallback([{ contentRect: { width: 100 } }] as any, null as any);

      // It should calculate that exactly 1 badge fits!
      expect(component.dynamicCount()).toBe(1);
    });

    it('should collapse to 0 if the screen is too slim for even one badge', () => {
      fixture.componentRef.setInput('keywords', ['One', 'Two']);
      fixture.detectChanges();

      const tape = component.measuringTape!.nativeElement;
      const badges = tape.querySelectorAll('.measure-badge');
      const extraBadge = tape.querySelector('.measure-extra');

      Object.defineProperty(badges[0], 'offsetWidth', { value: 100 });
      Object.defineProperty(badges[0], 'offsetLeft', { value: 0 });
      Object.defineProperty(badges[1], 'offsetWidth', { value: 100 });
      Object.defineProperty(badges[1], 'offsetLeft', { value: 100 });

      Object.defineProperty(extraBadge, 'offsetWidth', { value: 40 });

      // Trigger the resize callback with a tiny container width of 30px.
      // Available Space = 30(container) - 40(extra) - 4(gap) = -14px.
      // Badge 1 ends at 100px (DOES NOT FIT!).
      resizeCallback([{ contentRect: { width: 30 } }] as any, null as any);

      // It should calculate that 0 badges fit.
      expect(component.dynamicCount()).toBe(0);
    });
  });
});
