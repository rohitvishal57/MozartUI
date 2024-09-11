import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EndorsementsRoutingModule } from './endorsements-routing.module';
import { EndorsementsRequestsComponent } from './endorsements-requests/endorsements-requests.component';
import { EndorsementsNewRequestComponent } from './endorsements-new-request/endorsements-new-request.component';
import { PortalModule } from '@angular/cdk/portal';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MsalModule } from '@azure/msal-angular';
import { NgToastModule } from 'ng-angular-popup';
import { DndModule } from 'ngx-drag-drop';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MyMaterialModule } from 'src/app/material.module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    EndorsementsRequestsComponent,
    EndorsementsNewRequestComponent
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
    MyMaterialModule
  ],
  providers:[DatePipe]
})
export class EndorsementsModule { }
