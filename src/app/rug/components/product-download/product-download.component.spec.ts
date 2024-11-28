import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDownloadComponent } from './product-download.component';

describe('ProductDownloadComponent', () => {
  let component: ProductDownloadComponent;
  let fixture: ComponentFixture<ProductDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDownloadComponent]
    });
    fixture = TestBed.createComponent(ProductDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
