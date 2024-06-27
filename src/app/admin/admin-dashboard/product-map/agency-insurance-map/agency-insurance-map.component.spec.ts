import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyInsuranceMapComponent } from './agency-insurance-map.component';

describe('AgencyInsuranceMapComponent', () => {
  let component: AgencyInsuranceMapComponent;
  let fixture: ComponentFixture<AgencyInsuranceMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgencyInsuranceMapComponent]
    });
    fixture = TestBed.createComponent(AgencyInsuranceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
