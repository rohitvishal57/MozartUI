import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditpopupComponent } from './auditpopup.component';

describe('AuditpopupComponent', () => {
  let component: AuditpopupComponent;
  let fixture: ComponentFixture<AuditpopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditpopupComponent]
    });
    fixture = TestBed.createComponent(AuditpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
