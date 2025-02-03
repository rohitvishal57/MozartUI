import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YatraRoutingModule } from './yatra-routing.module';
import { YatraComponent } from './yatra.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MyMaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiSelectModule } from 'primeng/multiselect';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [YatraComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgModule,
    ClipboardModule,
    YatraRoutingModule,
    MyMaterialModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class YatraModule { }
