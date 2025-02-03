import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewForSoloJourneyComponent } from './view-for-solo-journey.component';

describe('ViewForSoloJourneyComponent', () => {
  let component: ViewForSoloJourneyComponent;
  let fixture: ComponentFixture<ViewForSoloJourneyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewForSoloJourneyComponent]
    });
    fixture = TestBed.createComponent(ViewForSoloJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
