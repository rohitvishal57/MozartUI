import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPerformaceComponent } from './my-performace.component';

describe('MyPerformaceComponent', () => {
  let component: MyPerformaceComponent;
  let fixture: ComponentFixture<MyPerformaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPerformaceComponent]
    });
    fixture = TestBed.createComponent(MyPerformaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
