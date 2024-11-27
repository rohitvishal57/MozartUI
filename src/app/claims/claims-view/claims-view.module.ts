import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimsViewComponent } from './claims-view.component';
import { ClaimsListViewComponent } from '../claims-list-view/claims-list-view.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepipePipe } from 'src/app/utilities/pipe/datepipe.pipe';
import { ClaimsRoutingModule } from './claims-view-routing.module';
import { ClaimsDetailsComponent } from '../claims-details/claims-details.component';
import { MyMaterialModule } from 'src/app/material.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [ClaimsViewComponent,ClaimsListViewComponent,DatepipePipe,ClaimsDetailsComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    ClaimsRoutingModule,
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
export class ClaimsViewModule { }
