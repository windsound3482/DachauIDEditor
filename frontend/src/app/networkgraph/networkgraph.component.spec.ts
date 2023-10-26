import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkgraphComponent } from './networkgraph.component';

describe('NetworkgraphComponent', () => {
  let component: NetworkgraphComponent;
  let fixture: ComponentFixture<NetworkgraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkgraphComponent]
    });
    fixture = TestBed.createComponent(NetworkgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
