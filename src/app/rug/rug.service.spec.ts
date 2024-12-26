import { TestBed } from '@angular/core/testing';

import { RugService } from './rug.service';

describe('RugService', () => {
  let service: RugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
