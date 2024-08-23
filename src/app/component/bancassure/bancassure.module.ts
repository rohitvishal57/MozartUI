import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BancassureRoutingModule } from './bancassure.routing-module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewproductsComponent } from './viewproducts/viewproducts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ReportsComponent } from './reports/reports.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AgentDynamicFormComponent } from './agent-dynamic-form/agent-dynamic-form.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { QuotesComponent } from '../renewals/quotes/quotes.component';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { RenewalDynamicFormComponent } from '../renewals/renewal-dynamic-form/renewal-dynamic-form.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ViewproductsComponent,
    DashboardComponent,
    TransactionComponent,
    ReportsComponent,  
    AgentDynamicFormComponent, 
    ProposalsComponent,
    QuotesComponent,
    RenewalDynamicFormComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    BancassureRoutingModule,
    NgxPaginationModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
  ]
})
export class BancassureModule { }
