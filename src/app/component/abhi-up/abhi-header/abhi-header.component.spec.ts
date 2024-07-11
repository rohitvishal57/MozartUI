import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhiHeaderComponent } from './abhi-header.component';

describe('AbhiHeaderComponent', () => {
  let component: AbhiHeaderComponent;
  let fixture: ComponentFixture<AbhiHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhiHeaderComponent]
    });
    fixture = TestBed.createComponent(AbhiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
