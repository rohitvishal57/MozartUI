import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CustomerJourneyComponent } from './customer-journey/customer-journey.component';
import { CustomerHealthTestComponent } from './customer-health-test/customer-health-test.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [CustomersListComponent, CustomerJourneyComponent, CustomerHealthTestComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    MyMaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class CustomersModule { }
