import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSequenceComponent } from './form-sequence.component';

describe('FormSequenceComponent', () => {
  let component: FormSequenceComponent;
  let fixture: ComponentFixture<FormSequenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSequenceComponent]
    });
    fixture = TestBed.createComponent(FormSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
