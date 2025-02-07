import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcCreateBataLeadsComponent } from './hdfc-create-bata-leads.component';

describe('HdfcCreateBataLeadsComponent', () => {
  let component: HdfcCreateBataLeadsComponent;
  let fixture: ComponentFixture<HdfcCreateBataLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HdfcCreateBataLeadsComponent]
    });
    fixture = TestBed.createComponent(HdfcCreateBataLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
