import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadBasecallerComponent } from './bulk-upload-basecaller.component';

describe('BulkUploadBasecallerComponent', () => {
  let component: BulkUploadBasecallerComponent;
  let fixture: ComponentFixture<BulkUploadBasecallerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkUploadBasecallerComponent]
    });
    fixture = TestBed.createComponent(BulkUploadBasecallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
