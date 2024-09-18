import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOtpViaComponent } from './send-otp-via.component';

describe('SendOtpViaComponent', () => {
  let component: SendOtpViaComponent;
  let fixture: ComponentFixture<SendOtpViaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendOtpViaComponent]
    });
    fixture = TestBed.createComponent(SendOtpViaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});