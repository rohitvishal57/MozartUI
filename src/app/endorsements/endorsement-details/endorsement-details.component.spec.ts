import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementDetailsComponent } from './endorsement-details.component';

describe('EndorsementDetailsComponent', () => {
  let component: EndorsementDetailsComponent;
  let fixture: ComponentFixture<EndorsementDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndorsementDetailsComponent]
    });
    fixture = TestBed.createComponent(EndorsementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
