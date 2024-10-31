import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuoteRoutingModule } from './quote-routing.module';
import { QuoteProductsComponent } from './quote-products/quote-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { GetQuoteComponent } from './get-quote/get-quote.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    QuoteProductsComponent,
    ProductDetailsComponent,
    GetQuoteComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxSliderModule,
    QuoteRoutingModule
  ],
  exports: [GetQuoteComponent] 
})
export class QuoteModule { }
