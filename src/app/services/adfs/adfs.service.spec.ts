import { TestBed } from '@angular/core/testing';

import { AdfsService } from './adfs.service';

describe('AdfsService', () => {
  let service: AdfsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdfsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
