import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { vi } from 'vitest';

import { NavbarComponent } from './navbar';

// 1. Create a dummy pipe that does absolutely nothing but satisfy Angular
@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([{ path: '**', component: NavbarComponent }])],
    })
      // 2. Rip out the real TranslatePipe and inject the dummy one
      .overrideComponent(NavbarComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('starts with the mobile menu closed', () => {
    expect(component.isMenuOpen()).toBe(false);
  });

  it('toggles the menu state when toggleMenu is called', () => {
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(true);

    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('forces the menu closed when closeMenu is called', () => {
    component.isMenuOpen.set(true);
    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('toggles the menu when the hamburger button is clicked in the DOM', () => {
    const button = fixture.debugElement.query(By.css('.mobile-toggle'));
    const clickEvent = { button: 0, preventDefault: vi.fn() };

    button.triggerEventHandler('click', clickEvent);
    expect(component.isMenuOpen()).toBe(true);

    button.triggerEventHandler('click', clickEvent);
    expect(component.isMenuOpen()).toBe(false);
  });

  it('closes the menu when a navigation link is clicked in the DOM', async () => {
    component.isMenuOpen.set(true);
    fixture.detectChanges();

    const clickEvent = {
      button: 0,
      preventDefault: vi.fn(),
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    };

    const link = fixture.debugElement.query(By.css('a[routerLink="/dashboard"]'));
    link.triggerEventHandler('click', clickEvent);

    expect(component.isMenuOpen()).toBe(false);
    await fixture.whenStable();
  });
});
