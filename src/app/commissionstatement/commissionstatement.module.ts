import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionstatementComponent } from './commissionstatement.component';
import { CommissionstatementRoutingModule } from './commissionstatement-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CommissionstatementComponent],
  imports: [
    CommonModule,
    CommissionstatementRoutingModule,
    ReactiveFormsModule
  ]
})
export class CommissionstatementModule { }
