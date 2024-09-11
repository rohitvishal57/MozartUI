import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhiNavbarComponent } from './abhi-navbar.component';

describe('AbhiNavbarComponent', () => {
  let component: AbhiNavbarComponent;
  let fixture: ComponentFixture<AbhiNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhiNavbarComponent]
    });
    fixture = TestBed.createComponent(AbhiNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
