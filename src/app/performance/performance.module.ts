import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { UploadPerformaceComponent } from './upload-performace/upload-performace.component';
import { MyMaterialModule } from '../material.module';
import { MyPerformaceComponent } from './my-performace/my-performace.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}

@NgModule({
  declarations: [
    MyPerformaceComponent,
    UploadPerformaceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PerformanceRoutingModule,
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
export class PerformanceModule { }
