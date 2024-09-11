import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcrDashboardComponent } from './ncr-dashboard.component';

describe('NcrDashboardComponent', () => {
  let component: NcrDashboardComponent;
  let fixture: ComponentFixture<NcrDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NcrDashboardComponent]
    });
    fixture = TestBed.createComponent(NcrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
