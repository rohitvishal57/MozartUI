import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMakerCheckerLeadsComponent } from './view-maker-checker-leads.component';

describe('ViewMakerCheckerLeadsComponent', () => {
  let component: ViewMakerCheckerLeadsComponent;
  let fixture: ComponentFixture<ViewMakerCheckerLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMakerCheckerLeadsComponent]
    });
    fixture = TestBed.createComponent(ViewMakerCheckerLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
