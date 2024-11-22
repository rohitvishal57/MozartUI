import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RugDynamicFormComponent } from './rug-dynamic-form.component';

describe('RugDynamicFormComponent', () => {
  let component: RugDynamicFormComponent;
  let fixture: ComponentFixture<RugDynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RugDynamicFormComponent]
    });
    fixture = TestBed.createComponent(RugDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
