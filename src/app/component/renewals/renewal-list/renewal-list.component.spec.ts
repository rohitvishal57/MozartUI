import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalListComponent } from './renewal-list.component';

describe('RenewalListComponent', () => {
  let component: RenewalListComponent;
  let fixture: ComponentFixture<RenewalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewalListComponent]
    });
    fixture = TestBed.createComponent(RenewalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
