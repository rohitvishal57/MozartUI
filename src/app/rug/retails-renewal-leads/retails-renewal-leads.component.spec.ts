import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailsRenewalLeadsComponent } from './retails-renewal-leads.component';

describe('RetailsRenewalLeadsComponent', () => {
  let component: RetailsRenewalLeadsComponent;
  let fixture: ComponentFixture<RetailsRenewalLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetailsRenewalLeadsComponent]
    });
    fixture = TestBed.createComponent(RetailsRenewalLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
