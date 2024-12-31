import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignpopupComponent } from './reassignpopup.component';

describe('ReassignpopupComponent', () => {
  let component: ReassignpopupComponent;
  let fixture: ComponentFixture<ReassignpopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReassignpopupComponent]
    });
    fixture = TestBed.createComponent(ReassignpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
