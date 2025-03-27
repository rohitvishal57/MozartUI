import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BataavLeadsListComponent } from './bataav-leads-list.component';

describe('BataavLeadsListComponent', () => {
  let component: BataavLeadsListComponent;
  let fixture: ComponentFixture<BataavLeadsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BataavLeadsListComponent]
    });
    fixture = TestBed.createComponent(BataavLeadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
