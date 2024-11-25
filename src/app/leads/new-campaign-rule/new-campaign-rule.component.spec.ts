import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCampaignRuleComponent } from './new-campaign-rule.component';

describe('NewCampaignRuleComponent', () => {
  let component: NewCampaignRuleComponent;
  let fixture: ComponentFixture<NewCampaignRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCampaignRuleComponent]
    });
    fixture = TestBed.createComponent(NewCampaignRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
