import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBasecallerComponent } from './create-basecaller.component';

describe('CreateBasecallerComponent', () => {
  let component: CreateBasecallerComponent;
  let fixture: ComponentFixture<CreateBasecallerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBasecallerComponent]
    });
    fixture = TestBed.createComponent(CreateBasecallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
