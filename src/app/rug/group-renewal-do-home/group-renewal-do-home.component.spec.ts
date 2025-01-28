import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRenewalDoHomeComponent } from './group-renewal-do-home.component';

describe('GroupRenewalDoHomeComponent', () => {
  let component: GroupRenewalDoHomeComponent;
  let fixture: ComponentFixture<GroupRenewalDoHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRenewalDoHomeComponent]
    });
    fixture = TestBed.createComponent(GroupRenewalDoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
