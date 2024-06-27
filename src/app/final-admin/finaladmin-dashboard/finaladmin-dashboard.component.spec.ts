import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaladminDashboardComponent } from './finaladmin-dashboard.component';

describe('FinaladminDashboardComponent', () => {
  let component: FinaladminDashboardComponent;
  let fixture: ComponentFixture<FinaladminDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinaladminDashboardComponent]
    });
    fixture = TestBed.createComponent(FinaladminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
