import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementsRequestsComponent } from './endorsements-requests.component';

describe('EndorsementsRequestsComponent', () => {
  let component: EndorsementsRequestsComponent;
  let fixture: ComponentFixture<EndorsementsRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndorsementsRequestsComponent]
    });
    fixture = TestBed.createComponent(EndorsementsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
