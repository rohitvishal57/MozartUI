import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { LeadsRoutingModule } from './leads-routing.module';


@NgModule({
  declarations: [
    LeadsListComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MyMaterialModule
  ]
})
export class LeadsModule { }
