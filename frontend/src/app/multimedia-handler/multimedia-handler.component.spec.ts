import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaHandlerComponent } from './multimedia-handler.component';

describe('MultimediaHandlerComponent', () => {
  let component: MultimediaHandlerComponent;
  let fixture: ComponentFixture<MultimediaHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultimediaHandlerComponent]
    });
    fixture = TestBed.createComponent(MultimediaHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
