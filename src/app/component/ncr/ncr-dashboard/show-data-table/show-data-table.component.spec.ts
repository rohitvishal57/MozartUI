import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDataTableComponent } from './show-data-table.component';

describe('ShowDataTableComponent', () => {
  let component: ShowDataTableComponent;
  let fixture: ComponentFixture<ShowDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowDataTableComponent]
    });
    fixture = TestBed.createComponent(ShowDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
