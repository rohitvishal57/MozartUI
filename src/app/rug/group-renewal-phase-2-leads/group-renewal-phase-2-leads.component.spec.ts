import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRenewalPhase2LeadsComponent } from './group-renewal-phase-2-leads.component';

describe('GroupRenewalPhase2LeadsComponent', () => {
  let component: GroupRenewalPhase2LeadsComponent;
  let fixture: ComponentFixture<GroupRenewalPhase2LeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRenewalPhase2LeadsComponent]
    });
    fixture = TestBed.createComponent(GroupRenewalPhase2LeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
