import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmDeleteObjectDialogComponent } from './comfirm-delete-object-dialog.component';

describe('ComfirmDeleteObjectDialogComponent', () => {
  let component: ComfirmDeleteObjectDialogComponent;
  let fixture: ComponentFixture<ComfirmDeleteObjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComfirmDeleteObjectDialogComponent]
    });
    fixture = TestBed.createComponent(ComfirmDeleteObjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
