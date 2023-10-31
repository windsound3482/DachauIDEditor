import { TestBed } from '@angular/core/testing';

import { NetworkgraphService } from './networkgraph.service';

describe('NetworkgraphService', () => {
  let service: NetworkgraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkgraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
