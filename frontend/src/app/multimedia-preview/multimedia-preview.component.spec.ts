import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaPreviewComponent } from './multimedia-preview.component';

describe('MultimediaPreviewComponent', () => {
  let component: MultimediaPreviewComponent;
  let fixture: ComponentFixture<MultimediaPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultimediaPreviewComponent]
    });
    fixture = TestBed.createComponent(MultimediaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
