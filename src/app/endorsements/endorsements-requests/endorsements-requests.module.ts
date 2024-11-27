import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementsRoutingModule } from './endorsements-requests-routing.module';
import { EndorsementsNewRequestComponent } from '../endorsements-new-request/endorsements-new-request.component';
import { EndorsementsRequestsComponent } from './endorsements-requests.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EndorsementDetailsComponent } from '../endorsement-details/endorsement-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}

@NgModule({
  declarations: [EndorsementsNewRequestComponent,EndorsementsRequestsComponent,EndorsementDetailsComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    EndorsementsRoutingModule,
    MatAutocompleteModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class EndorsementsRequestsModule { }