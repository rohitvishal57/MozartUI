import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancaAgentDashboardComponent } from './banca-agent-dashboard.component';

describe('BancaAgentDashboardComponent', () => {
  let component: BancaAgentDashboardComponent;
  let fixture: ComponentFixture<BancaAgentDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BancaAgentDashboardComponent]
    });
    fixture = TestBed.createComponent(BancaAgentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
