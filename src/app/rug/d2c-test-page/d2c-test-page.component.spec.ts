import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D2cTestPageComponent } from './d2c-test-page.component';

describe('D2cTestPageComponent', () => {
  let component: D2cTestPageComponent;
  let fixture: ComponentFixture<D2cTestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [D2cTestPageComponent]
    });
    fixture = TestBed.createComponent(D2cTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
