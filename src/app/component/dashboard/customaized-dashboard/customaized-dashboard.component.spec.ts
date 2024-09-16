import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomaizedDashboardComponent } from './customaized-dashboard.component';

describe('CustomaizedDashboardComponent', () => {
  let component: CustomaizedDashboardComponent;
  let fixture: ComponentFixture<CustomaizedDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomaizedDashboardComponent]
    });
    fixture = TestBed.createComponent(CustomaizedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
