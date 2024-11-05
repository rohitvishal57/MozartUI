import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementsRoutingModule } from './endorsements-requests-routing.module';
import { EndorsementsNewRequestComponent } from '../endorsements-new-request/endorsements-new-request.component';
import { EndorsementsRequestsComponent } from './endorsements-requests.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EndorsementDetailsComponent } from '../endorsement-details/endorsement-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [EndorsementsNewRequestComponent,EndorsementsRequestsComponent,EndorsementDetailsComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    EndorsementsRoutingModule,
    MatAutocompleteModule
  ]
})
export class EndorsementsRequestsModule { }
