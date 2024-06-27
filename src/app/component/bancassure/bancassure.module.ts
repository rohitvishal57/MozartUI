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

@NgModule({
  declarations: [
    ViewproductsComponent,
    DashboardComponent,
    TransactionComponent,
    ReportsComponent,  
    AgentDynamicFormComponent, ProposalsComponent  
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    BancassureRoutingModule,
  ]
})
export class BancassureModule { }
