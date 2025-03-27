import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasypayCheckComponent } from './easypay-check.component';

describe('EasypayCheckComponent', () => {
  let component: EasypayCheckComponent;
  let fixture: ComponentFixture<EasypayCheckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EasypayCheckComponent]
    });
    fixture = TestBed.createComponent(EasypayCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
