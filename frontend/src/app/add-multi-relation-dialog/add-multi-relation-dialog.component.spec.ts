import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultiRelationDialogComponent } from './add-multi-relation-dialog.component';

describe('AddMultiRelationDialogComponent', () => {
  let component: AddMultiRelationDialogComponent;
  let fixture: ComponentFixture<AddMultiRelationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMultiRelationDialogComponent]
    });
    fixture = TestBed.createComponent(AddMultiRelationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
