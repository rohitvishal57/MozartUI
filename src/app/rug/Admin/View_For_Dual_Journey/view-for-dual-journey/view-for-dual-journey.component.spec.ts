import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewForDualJourneyComponent } from './view-for-dual-journey.component';

describe('ViewForDualJourneyComponent', () => {
  let component: ViewForDualJourneyComponent;
  let fixture: ComponentFixture<ViewForDualJourneyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewForDualJourneyComponent]
    });
    fixture = TestBed.createComponent(ViewForDualJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
