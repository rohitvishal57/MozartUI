import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLeadComponent } from './upload-lead.component';

describe('UploadLeadComponent', () => {
  let component: UploadLeadComponent;
  let fixture: ComponentFixture<UploadLeadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadLeadComponent]
    });
    fixture = TestBed.createComponent(UploadLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
