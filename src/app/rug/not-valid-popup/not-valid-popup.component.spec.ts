import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotValidPopupComponent } from './not-valid-popup.component';

describe('NotValidPopupComponent', () => {
  let component: NotValidPopupComponent;
  let fixture: ComponentFixture<NotValidPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotValidPopupComponent]
    });
    fixture = TestBed.createComponent(NotValidPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
