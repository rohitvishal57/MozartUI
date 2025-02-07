import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcJourneySelectionsComponent } from './hdfc-journey-selections.component';

describe('HdfcJourneySelectionsComponent', () => {
  let component: HdfcJourneySelectionsComponent;
  let fixture: ComponentFixture<HdfcJourneySelectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HdfcJourneySelectionsComponent]
    });
    fixture = TestBed.createComponent(HdfcJourneySelectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
