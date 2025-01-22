import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedPopupComponent } from './updated-popup.component';

describe('UpdatedPopupComponent', () => {
  let component: UpdatedPopupComponent;
  let fixture: ComponentFixture<UpdatedPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatedPopupComponent]
    });
    fixture = TestBed.createComponent(UpdatedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
