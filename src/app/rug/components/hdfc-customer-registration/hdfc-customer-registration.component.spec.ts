import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcCustomerRegistrationComponent } from './hdfc-customer-registration.component';

describe('HdfcCustomerRegistrationComponent', () => {
  let component: HdfcCustomerRegistrationComponent;
  let fixture: ComponentFixture<HdfcCustomerRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HdfcCustomerRegistrationComponent]
    });
    fixture = TestBed.createComponent(HdfcCustomerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
