import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BataDetailsComponent } from './bata-details.component';

describe('BataDetailsComponent', () => {
  let component: BataDetailsComponent;
  let fixture: ComponentFixture<BataDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BataDetailsComponent]
    });
    fixture = TestBed.createComponent(BataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
