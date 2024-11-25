import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProposalsListComponent } from './proposals-list/proposals-list.component';
import { ProposalsRoutingModule } from './proposals-routing.module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [ProposalsListComponent],
  imports: [
    CommonModule,
    ProposalsRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    MyMaterialModule
  ]
})
export class ProposalsModule { }
