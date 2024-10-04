import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenewalsRoutingModule } from './renewals-routing.module';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { RenewalDynamicFormComponent } from './renewal-dynamic-form/renewal-dynamic-form.component';
import { SubQuotesComponent } from './sub-quotes/sub-quotes.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    RenewalListComponent,
    RenewalDynamicFormComponent,
    SubQuotesComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MyMaterialModule,
    RenewalsRoutingModule
  ]
})
export class RenewalsModule { }
