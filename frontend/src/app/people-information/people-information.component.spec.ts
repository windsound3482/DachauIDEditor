import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleInformationComponent } from './people-information.component';

describe('PeopleInformationComponent', () => {
  let component: PeopleInformationComponent;
  let fixture: ComponentFixture<PeopleInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleInformationComponent]
    });
    fixture = TestBed.createComponent(PeopleInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
