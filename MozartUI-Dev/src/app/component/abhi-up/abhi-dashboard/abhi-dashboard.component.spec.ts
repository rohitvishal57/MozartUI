import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhiDashboardComponent } from './abhi-dashboard.component';

describe('AbhiDashboardComponent', () => {
  let component: AbhiDashboardComponent;
  let fixture: ComponentFixture<AbhiDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhiDashboardComponent]
    });
    fixture = TestBed.createComponent(AbhiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
