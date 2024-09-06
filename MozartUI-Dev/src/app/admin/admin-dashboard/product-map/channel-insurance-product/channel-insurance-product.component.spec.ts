import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelInsuranceProductComponent } from './channel-insurance-product.component';

describe('ChannelInsuranceProductComponent', () => {
  let component: ChannelInsuranceProductComponent;
  let fixture: ComponentFixture<ChannelInsuranceProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelInsuranceProductComponent]
    });
    fixture = TestBed.createComponent(ChannelInsuranceProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
