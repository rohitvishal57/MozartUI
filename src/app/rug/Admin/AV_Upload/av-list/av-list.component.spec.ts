import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVListComponent } from './av-list.component';

describe('AVListComponent', () => {
  let component: AVListComponent;
  let fixture: ComponentFixture<AVListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AVListComponent]
    });
    fixture = TestBed.createComponent(AVListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
