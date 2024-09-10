import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcrLoginComponent } from './ncr-login.component';

describe('NcrLoginComponent', () => {
  let component: NcrLoginComponent;
  let fixture: ComponentFixture<NcrLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NcrLoginComponent]
    });
    fixture = TestBed.createComponent(NcrLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
