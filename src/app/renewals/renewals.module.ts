import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenewalsRoutingModule } from './renewals-routing.module';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { RenewalDynamicFormComponent } from './renewal-dynamic-form/renewal-dynamic-form.component';
import { SubQuotesComponent } from './sub-quotes/sub-quotes.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PaymentstatusComponent } from './paymentstatus/paymentstatus.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { RenewalJourneyComponent } from './renewal-journey/renewal-journey.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [
    RenewalListComponent,
    RenewalDynamicFormComponent,
    SubQuotesComponent,
    PaymentstatusComponent,
    RenewalJourneyComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    MyMaterialModule,
    RenewalsRoutingModule,
    NgxSliderModule,
    ClipboardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class RenewalsModule { }
