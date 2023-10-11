import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationHandlerComponent } from './relation-handler.component';

describe('RelationHandlerComponent', () => {
  let component: RelationHandlerComponent;
  let fixture: ComponentFixture<RelationHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelationHandlerComponent]
    });
    fixture = TestBed.createComponent(RelationHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
