import { TestBed } from '@angular/core/testing';

import { CommissionstatementService } from './commissionstatement.service';

describe('CommissionstatementService', () => {
  let service: CommissionstatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissionstatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
