import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnverifiedLeadsComponent } from './view-unverified-leads.component';

describe('ViewUnverifiedLeadsComponent', () => {
  let component: ViewUnverifiedLeadsComponent;
  let fixture: ComponentFixture<ViewUnverifiedLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUnverifiedLeadsComponent]
    });
    fixture = TestBed.createComponent(ViewUnverifiedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
