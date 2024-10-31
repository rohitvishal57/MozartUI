import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GetQuoteComponent } from '../../quote/get-quote/get-quote.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { QuoteModule } from 'src/app/quote/quote.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MyMaterialModule,
    NgxSliderModule,
    DashboardRoutingModule,
    QuoteModule
  ]
})
export class DashboardModule { }
