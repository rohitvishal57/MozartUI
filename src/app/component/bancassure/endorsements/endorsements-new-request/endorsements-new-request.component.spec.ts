import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementsNewRequestComponent } from './endorsements-new-request.component';

describe('EndorsementsNewRequestComponent', () => {
  let component: EndorsementsNewRequestComponent;
  let fixture: ComponentFixture<EndorsementsNewRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndorsementsNewRequestComponent]
    });
    fixture = TestBed.createComponent(EndorsementsNewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
