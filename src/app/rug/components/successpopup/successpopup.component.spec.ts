import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesspopupComponent } from './successpopup.component';

describe('SuccesspopupComponent', () => {
  let component: SuccesspopupComponent;
  let fixture: ComponentFixture<SuccesspopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccesspopupComponent]
    });
    fixture = TestBed.createComponent(SuccesspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
