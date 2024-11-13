import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GetQuoteComponent } from '../../quote/get-quote/get-quote.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { QuoteModule } from 'src/app/quote/quote.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    MyMaterialModule,
    NgxSliderModule,
    DashboardRoutingModule,
    QuoteModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class DashboardModule { }