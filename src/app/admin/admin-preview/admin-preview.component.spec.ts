import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPreviewComponent } from './admin-preview.component';

describe('AdminPreviewComponent', () => {
  let component: AdminPreviewComponent;
  let fixture: ComponentFixture<AdminPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPreviewComponent]
    });
    fixture = TestBed.createComponent(AdminPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
