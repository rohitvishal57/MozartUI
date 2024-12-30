import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasecallerListComponent } from './basecaller-list.component';

describe('BasecallerListComponent', () => {
  let component: BasecallerListComponent;
  let fixture: ComponentFixture<BasecallerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasecallerListComponent]
    });
    fixture = TestBed.createComponent(BasecallerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
