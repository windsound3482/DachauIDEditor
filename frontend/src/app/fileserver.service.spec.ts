import { TestBed } from '@angular/core/testing';

import { FileserverService } from './fileserver.service';

describe('FileserverService', () => {
  let service: FileserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
