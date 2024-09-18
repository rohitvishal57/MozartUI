import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EndorsementsRoutingModule } from './endorsements-routing.module';
import { EndorsementsRequestsComponent } from './endorsements-requests/endorsements-requests.component';
import { EndorsementsNewRequestComponent } from './endorsements-new-request/endorsements-new-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MyMaterialModule } from 'src/app/material.module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SendOtpViaComponent } from '../agent-login/send-otp-via/send-otp-via.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    EndorsementsRequestsComponent,
    EndorsementsNewRequestComponent,
    SendOtpViaComponent
  ],
  imports: [
    CommonModule,
    EndorsementsRoutingModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatMenuModule,
    MyMaterialModule,
    MatDialogModule
  ],
  providers:[DatePipe]
})
export class EndorsementsModule { }
