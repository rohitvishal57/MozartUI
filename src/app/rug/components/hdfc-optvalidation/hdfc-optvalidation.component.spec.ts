import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdfcOptvalidationComponent } from './hdfc-optvalidation.component';

describe('HdfcOptvalidationComponent', () => {
  let component: HdfcOptvalidationComponent;
  let fixture: ComponentFixture<HdfcOptvalidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HdfcOptvalidationComponent]
    });
    fixture = TestBed.createComponent(HdfcOptvalidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
