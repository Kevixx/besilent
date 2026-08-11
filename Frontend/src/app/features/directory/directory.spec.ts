import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DirectoryComponent } from './directory';

describe('Directory', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            instant: vi.fn((key: string) => key),
            translate: vi.fn((key: string) => of(key)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
