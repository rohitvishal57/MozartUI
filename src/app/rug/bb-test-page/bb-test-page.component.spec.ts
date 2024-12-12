import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbTestPageComponent } from './bb-test-page.component';

describe('BbTestPageComponent', () => {
  let component: BbTestPageComponent;
  let fixture: ComponentFixture<BbTestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BbTestPageComponent]
    });
    fixture = TestBed.createComponent(BbTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
