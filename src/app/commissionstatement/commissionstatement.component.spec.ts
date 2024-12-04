import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionstatementComponent } from './commissionstatement.component';

describe('CommissionstatementComponent', () => {
  let component: CommissionstatementComponent;
  let fixture: ComponentFixture<CommissionstatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionstatementComponent]
    });
    fixture = TestBed.createComponent(CommissionstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
