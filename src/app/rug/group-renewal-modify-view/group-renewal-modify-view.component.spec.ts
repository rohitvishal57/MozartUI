import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRenewalModifyViewComponent } from './group-renewal-modify-view.component';

describe('GroupRenewalModifyViewComponent', () => {
  let component: GroupRenewalModifyViewComponent;
  let fixture: ComponentFixture<GroupRenewalModifyViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRenewalModifyViewComponent]
    });
    fixture = TestBed.createComponent(GroupRenewalModifyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
