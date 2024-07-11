import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhiDynamicFormComponent } from './abhi-dynamic-form.component';

describe('AbhiDynamicFormComponent', () => {
  let component: AbhiDynamicFormComponent;
  let fixture: ComponentFixture<AbhiDynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhiDynamicFormComponent]
    });
    fixture = TestBed.createComponent(AbhiDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
