import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelInsuranceMapComponent } from './channel-insurance-map.component';

describe('ChannelInsuranceMapComponent', () => {
  let component: ChannelInsuranceMapComponent;
  let fixture: ComponentFixture<ChannelInsuranceMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelInsuranceMapComponent]
    });
    fixture = TestBed.createComponent(ChannelInsuranceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
