import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLobComponent } from './create-lob.component';

describe('CreateLobComponent', () => {
  let component: CreateLobComponent;
  let fixture: ComponentFixture<CreateLobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLobComponent]
    });
    fixture = TestBed.createComponent(CreateLobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
