import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleHandlerComponent } from './people-handler.component';

describe('PeopleHandlerComponent', () => {
  let component: PeopleHandlerComponent;
  let fixture: ComponentFixture<PeopleHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleHandlerComponent]
    });
    fixture = TestBed.createComponent(PeopleHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
