import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcBataLeadsListComponent } from './hdfc-bata-leads-list.component';

describe('HdfcBataLeadsListComponent', () => {
  let component: HdfcBataLeadsListComponent;
  let fixture: ComponentFixture<HdfcBataLeadsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HdfcBataLeadsListComponent]
    });
    fixture = TestBed.createComponent(HdfcBataLeadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
