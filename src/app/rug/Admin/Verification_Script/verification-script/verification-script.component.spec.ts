import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationScriptComponent } from './verification-script.component';

describe('VerificationScriptComponent', () => {
  let component: VerificationScriptComponent;
  let fixture: ComponentFixture<VerificationScriptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationScriptComponent]
    });
    fixture = TestBed.createComponent(VerificationScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
