import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDynamicFormComponent } from './agent-dynamic-form.component';

describe('AgentDynamicFormComponent', () => {
  let component: AgentDynamicFormComponent;
  let fixture: ComponentFixture<AgentDynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentDynamicFormComponent]
    });
    fixture = TestBed.createComponent(AgentDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
