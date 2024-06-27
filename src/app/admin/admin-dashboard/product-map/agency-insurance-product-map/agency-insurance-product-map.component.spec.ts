import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyInsuranceProductMapComponent } from './agency-insurance-product-map.component';

describe('AgencyInsuranceProductMapComponent', () => {
  let component: AgencyInsuranceProductMapComponent;
  let fixture: ComponentFixture<AgencyInsuranceProductMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgencyInsuranceProductMapComponent]
    });
    fixture = TestBed.createComponent(AgencyInsuranceProductMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
