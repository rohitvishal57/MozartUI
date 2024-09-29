import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsListComponent } from './proposals-list.component';

describe('ProposalsListComponent', () => {
  let component: ProposalsListComponent;
  let fixture: ComponentFixture<ProposalsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalsListComponent]
    });
    fixture = TestBed.createComponent(ProposalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
