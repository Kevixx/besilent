import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryComponent } from './directory';

describe('Directory', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
