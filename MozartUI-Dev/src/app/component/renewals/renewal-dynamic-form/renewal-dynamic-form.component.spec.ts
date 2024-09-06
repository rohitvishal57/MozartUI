import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalDynamicFormComponent } from './renewal-dynamic-form.component';

describe('RenewalDynamicFormComponent', () => {
  let component: RenewalDynamicFormComponent;
  let fixture: ComponentFixture<RenewalDynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewalDynamicFormComponent]
    });
    fixture = TestBed.createComponent(RenewalDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
