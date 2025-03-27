import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCheckComponent } from './payment-check.component';

describe('PaymentCheckComponent', () => {
  let component: PaymentCheckComponent;
  let fixture: ComponentFixture<PaymentCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCheckComponent]
    });
    fixture = TestBed.createComponent(PaymentCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
