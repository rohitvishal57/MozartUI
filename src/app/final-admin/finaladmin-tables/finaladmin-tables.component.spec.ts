import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaladminTablesComponent } from './finaladmin-tables.component';

describe('FinaladminTablesComponent', () => {
  let component: FinaladminTablesComponent;
  let fixture: ComponentFixture<FinaladminTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinaladminTablesComponent]
    });
    fixture = TestBed.createComponent(FinaladminTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
