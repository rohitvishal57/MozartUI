import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YatraComponent } from './yatra.component';

describe('YatraComponent', () => {
  let component: YatraComponent;
  let fixture: ComponentFixture<YatraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YatraComponent]
    });
    fixture = TestBed.createComponent(YatraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
