import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCheckComponent } from './policy-check.component';

describe('PolicyCheckComponent', () => {
  let component: PolicyCheckComponent;
  let fixture: ComponentFixture<PolicyCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyCheckComponent]
    });
    fixture = TestBed.createComponent(PolicyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
