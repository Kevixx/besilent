import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipComponent } from './tooltip';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;

    // Provide a default value for the required input to prevent Angular warnings
    component.text = 'Default text';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Logic: displayText getter', () => {
    it('should return a string exactly as provided', () => {
      component.text = 'Just a string';
      expect(component.displayText).toBe('Just a string');
    });

    it('should join an array of strings with commas and spaces', () => {
      component.text = ['Keyword1', 'Keyword2', 'Keyword3'];
      expect(component.displayText).toBe('Keyword1, Keyword2, Keyword3');
    });

    it('should return an empty string if text is an empty string', () => {
      component.text = '';
      expect(component.displayText).toBe('');
    });
  });

  describe('DOM Rendering: Conditional displays and classes', () => {
    it('should render the tooltip text when enabled and text exists', () => {
      // Use setInput to properly trigger Angular's change detection
      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('text', 'Visible tooltip');
      fixture.detectChanges();

      const tooltipElement = fixture.debugElement.query(By.css('.tooltip-text'));
      expect(tooltipElement).toBeTruthy();
      expect(tooltipElement.nativeElement.textContent.trim()).toBe('Visible tooltip');
    });

    it('should NOT render the tooltip box when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('text', 'This should be hidden');
      fixture.detectChanges();

      const tooltipElement = fixture.debugElement.query(By.css('.tooltip-text'));
      expect(tooltipElement).toBeNull();
    });

    it('should NOT render the tooltip box when displayText evaluates to empty', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('text', '');
      fixture.detectChanges();

      const tooltipElement = fixture.debugElement.query(By.css('.tooltip-text'));
      expect(tooltipElement).toBeNull();
    });

    it('should apply the "tooltip-top" class when position is set to top', () => {
      fixture.componentRef.setInput('position', 'top');
      fixture.componentRef.setInput('text', 'Top tooltip');
      fixture.detectChanges();

      const tooltipElement = fixture.debugElement.query(By.css('.tooltip-text'));
      expect(tooltipElement.classes['tooltip-top']).toBeTruthy();
    });

    it('should NOT apply the "tooltip-top" class when position is set to bottom', () => {
      fixture.componentRef.setInput('position', 'bottom');
      fixture.componentRef.setInput('text', 'Bottom tooltip');
      fixture.detectChanges();

      const tooltipElement = fixture.debugElement.query(By.css('.tooltip-text'));
      expect(tooltipElement.classes['tooltip-top']).toBeFalsy();
    });
  });
});
