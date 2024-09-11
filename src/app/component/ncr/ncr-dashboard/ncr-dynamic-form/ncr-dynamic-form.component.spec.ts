import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcrDynamicFormComponent } from './ncr-dynamic-form.component';

describe('NcrDynamicFormComponent', () => {
  let component: NcrDynamicFormComponent;
  let fixture: ComponentFixture<NcrDynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NcrDynamicFormComponent]
    });
    fixture = TestBed.createComponent(NcrDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
