import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubQuotesComponent } from './sub-quotes.component';

describe('SubQuotesComponent', () => {
  let component: SubQuotesComponent;
  let fixture: ComponentFixture<SubQuotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubQuotesComponent]
    });
    fixture = TestBed.createComponent(SubQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
