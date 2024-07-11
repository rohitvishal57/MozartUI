import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhiupComponent } from './abhi-up.component';

describe('AbhiupComponent', () => {
  let component: AbhiupComponent;
  let fixture: ComponentFixture<AbhiupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhiupComponent]
    });
    fixture = TestBed.createComponent(AbhiupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
