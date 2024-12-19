import { TestBed } from '@angular/core/testing';

import { PincodeSharedService } from './pincode-shared.service';

describe('PincodeSharedService', () => {
  let service: PincodeSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PincodeSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
