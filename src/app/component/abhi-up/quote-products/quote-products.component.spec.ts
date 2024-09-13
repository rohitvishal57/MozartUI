import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteProductsComponent } from './quote-products.component';

describe('QuoteProductsComponent', () => {
  let component: QuoteProductsComponent;
  let fixture: ComponentFixture<QuoteProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteProductsComponent]
    });
    fixture = TestBed.createComponent(QuoteProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
