import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAVComponent } from './create-av.component';

describe('CreateAVComponent', () => {
  let component: CreateAVComponent;
  let fixture: ComponentFixture<CreateAVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAVComponent]
    });
    fixture = TestBed.createComponent(CreateAVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
