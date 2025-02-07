import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCheckComponent } from './lead-check.component';

describe('LeadCheckComponent', () => {
  let component: LeadCheckComponent;
  let fixture: ComponentFixture<LeadCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadCheckComponent]
    });
    fixture = TestBed.createComponent(LeadCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
