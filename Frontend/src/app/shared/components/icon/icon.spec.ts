import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;

    // Set the required input before running change detection
    component.src = '/assets/icons/logout.svg';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the default size of 24px', () => {
    expect(component.size).toBe('24px');

    // Check if the @HostBinding correctly applied the width and height
    expect(hostElement.style.width).toBe('24px');
    expect(hostElement.style.height).toBe('24px');
  });

  it('should generate the correct dynamic CSS variable for the icon URL', () => {
    // The @HostBinding binds to a custom CSS variable --icon-url
    const iconUrlVar = hostElement.style.getPropertyValue('--icon-url');

    expect(component.src).toBe('/assets/icons/logout.svg');
    expect(iconUrlVar).toBe("url('/assets/icons/logout.svg')");
  });

  it('should update the styles when a custom size is provided', () => {
    // Act
    // Replace direct assignment with setInput()
    fixture.componentRef.setInput('size', '1.5rem');
    fixture.detectChanges();

    // Assert
    expect(hostElement.style.width).toBe('1.5rem');
    expect(hostElement.style.height).toBe('1.5rem');
  });

  it('should update the icon URL when the iconUrl input changes', () => {
    // Act
    // Replace direct assignment with setInput()
    fixture.componentRef.setInput('src', '/assets/icons/settings.svg');
    fixture.detectChanges();

    // Assert
    const iconUrlVar = hostElement.style.getPropertyValue('--icon-url');
    expect(iconUrlVar).toBe("url('/assets/icons/settings.svg')");
  });

  it('should override size with explicit height if provided', () => {
    // Act
    fixture.componentRef.setInput('size', '24px');
    fixture.componentRef.setInput('height', '36px');
    fixture.detectChanges();

    // Assert
    expect(hostElement.style.height).toBe('36px');
    // Width should still fall back to size since it wasn't explicitly provided
    expect(hostElement.style.width).toBe('24px');
  });

  it('should override size with explicit width if provided', () => {
    // Act
    fixture.componentRef.setInput('size', '24px');
    fixture.componentRef.setInput('width', 'auto');
    fixture.detectChanges();

    // Assert
    expect(hostElement.style.width).toBe('auto');
    // Height should still fall back to size
    expect(hostElement.style.height).toBe('24px');
  });
});
