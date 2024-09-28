import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusValidationComponent } from './status-validation.component';

describe('StatusValidationComponent', () => {
  let component: StatusValidationComponent;
  let fixture: ComponentFixture<StatusValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusValidationComponent]
    });
    fixture = TestBed.createComponent(StatusValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
