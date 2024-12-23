import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProposalsListComponent } from './proposals-list/proposals-list.component';
import { ProposalsRoutingModule } from './proposals-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ProposalShareConsentComponent } from './proposal-share-consent/proposal-share-consent.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [ProposalsListComponent, ProposalShareConsentComponent],
  imports: [
    CommonModule,
    ProposalsRoutingModule,
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
export class ProposalsModule { }
