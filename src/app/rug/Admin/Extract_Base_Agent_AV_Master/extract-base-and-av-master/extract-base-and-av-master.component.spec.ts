import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractBaseAndAvMasterComponent } from './extract-base-and-av-master.component';

describe('ExtractBaseAndAvMasterComponent', () => {
  let component: ExtractBaseAndAvMasterComponent;
  let fixture: ComponentFixture<ExtractBaseAndAvMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtractBaseAndAvMasterComponent]
    });
    fixture = TestBed.createComponent(ExtractBaseAndAvMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
