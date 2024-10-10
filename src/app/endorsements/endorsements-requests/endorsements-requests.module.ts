import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementsRoutingModule } from './endorsements-requests-routing.module';
import { EndorsementsNewRequestComponent } from '../endorsements-new-request/endorsements-new-request.component';
import { EndorsementsRequestsComponent } from './endorsements-requests.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EndorsementDetailsComponent } from '../endorsement-details/endorsement-details.component';

@NgModule({
  declarations: [EndorsementsNewRequestComponent,EndorsementsRequestsComponent,EndorsementDetailsComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    EndorsementsRoutingModule
  ]
})
export class EndorsementsRequestsModule { }
