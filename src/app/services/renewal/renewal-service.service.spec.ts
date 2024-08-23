import { TestBed } from '@angular/core/testing';

import { RenewalServiceService } from './renewal-service.service';

describe('RenewalServiceService', () => {
  let service: RenewalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenewalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
