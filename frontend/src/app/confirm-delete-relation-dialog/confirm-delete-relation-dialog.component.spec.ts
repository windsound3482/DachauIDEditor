import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteRelationDialogComponent } from './confirm-delete-relation-dialog.component';

describe('ConfirmDeleteRelationDialogComponent', () => {
  let component: ConfirmDeleteRelationDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteRelationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeleteRelationDialogComponent]
    });
    fixture = TestBed.createComponent(ConfirmDeleteRelationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
