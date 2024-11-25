import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComparisonComponent } from './product-comparison/product-comparison.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}

@NgModule({
  declarations: [ProductsComponent, ProductComparisonComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ProductsModule { }
