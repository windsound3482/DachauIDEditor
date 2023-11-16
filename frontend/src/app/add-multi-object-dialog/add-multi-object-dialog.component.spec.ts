import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultiObjectDialogComponent } from './add-multi-object-dialog.component';

describe('AddMultiObjectDialogComponent', () => {
  let component: AddMultiObjectDialogComponent;
  let fixture: ComponentFixture<AddMultiObjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMultiObjectDialogComponent]
    });
    fixture = TestBed.createComponent(AddMultiObjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
