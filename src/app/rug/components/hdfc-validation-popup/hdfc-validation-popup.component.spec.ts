import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcValidationPopupComponent } from './hdfc-validation-popup.component';

describe('HdfcValidationPopupComponent', () => {
  let component: HdfcValidationPopupComponent;
  let fixture: ComponentFixture<HdfcValidationPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HdfcValidationPopupComponent]
    });
    fixture = TestBed.createComponent(HdfcValidationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
