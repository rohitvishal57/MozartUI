import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsListViewComponent } from './claims-list-view.component';

describe('ClaimsListViewComponent', () => {
  let component: ClaimsListViewComponent;
  let fixture: ComponentFixture<ClaimsListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsListViewComponent]
    });
    fixture = TestBed.createComponent(ClaimsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
