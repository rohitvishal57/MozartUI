import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPopupComponent } from './otp-popup.component';

describe('OtpPopupComponent', () => {
  let component: OtpPopupComponent;
  let fixture: ComponentFixture<OtpPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtpPopupComponent]
    });
    fixture = TestBed.createComponent(OtpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
