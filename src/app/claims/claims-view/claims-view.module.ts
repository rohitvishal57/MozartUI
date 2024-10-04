import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimsViewComponent } from './claims-view.component';
import { ClaimsListViewComponent } from '../claims-list-view/claims-list-view.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatepipePipe } from 'src/app/utilities/pipe/datepipe.pipe';
import { ClaimsRoutingModule } from './claims-view-routing.module';
import { ClaimsDetailsComponent } from '../claims-details/claims-details.component';
import { MyMaterialModule } from 'src/app/material.module';
@NgModule({
  declarations: [ClaimsViewComponent,ClaimsListViewComponent,DatepipePipe,ClaimsDetailsComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ClaimsRoutingModule,
    MyMaterialModule
  ]
})
export class ClaimsViewModule { }
