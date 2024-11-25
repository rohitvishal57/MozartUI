import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPerformaceComponent } from './upload-performace.component';

describe('UploadPerformaceComponent', () => {
  let component: UploadPerformaceComponent;
  let fixture: ComponentFixture<UploadPerformaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPerformaceComponent]
    });
    fixture = TestBed.createComponent(UploadPerformaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
