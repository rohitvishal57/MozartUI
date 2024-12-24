import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalPolicyViewDetailsComponent } from './proposal-policy-view-details.component';

describe('ProposalPolicyViewDetailsComponent', () => {
  let component: ProposalPolicyViewDetailsComponent;
  let fixture: ComponentFixture<ProposalPolicyViewDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalPolicyViewDetailsComponent]
    });
    fixture = TestBed.createComponent(ProposalPolicyViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
