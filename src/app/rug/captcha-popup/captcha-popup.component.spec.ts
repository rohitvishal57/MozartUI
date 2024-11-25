import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaPopupComponent } from './captcha-popup.component';

describe('CaptchaPopupComponent', () => {
  let component: CaptchaPopupComponent;
  let fixture: ComponentFixture<CaptchaPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptchaPopupComponent]
    });
    fixture = TestBed.createComponent(CaptchaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
