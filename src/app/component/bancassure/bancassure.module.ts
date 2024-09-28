import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BancassureRoutingModule } from './bancassure.routing-module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewproductsComponent } from './viewproducts/viewproducts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ReportsComponent } from './reports/reports.component';
import { AgentDynamicFormComponent } from './agent-dynamic-form/agent-dynamic-form.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { RenewalDynamicFormComponent } from '../renewals/renewal-dynamic-form/renewal-dynamic-form.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MyMaterialModule } from 'src/app/material.module';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimsViewComponent } from './claims/claims-view/claims-view.component';
import { ClaimsListViewComponent } from './claims/claims-list-view/claims-list-view.component';
import { RenewalListComponent } from '../renewals/renewal-list/renewal-list.component';
import { DatepipePipe } from 'src/app/pipe/datepipe.pipe';
import { EndorsementsModule } from './endorsements/endorsements.module';
import { AbhiDashboardComponent } from '../abhi-up/abhi-dashboard/abhi-dashboard.component';
import { GetQuoteComponent } from '../abhi-up/get-quote/get-quote.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SubQuotesComponent } from '../renewals/sub-quotes/sub-quotes.component';
import { LeadsListComponent } from '../leads/leads-list/leads-list.component';
import { ProposalsListComponent } from '../proposals/proposals-list/proposals-list.component';
import { CustomerListComponent } from '../customers/customer-list/customer-list.component';

@NgModule({
  declarations: [
    // Your components
  ],
  imports: [
    // Other Angular modules
    MatMenuModule, // Add this line
  ],
  providers: [],
  bootstrap: [/* Your bootstrap component */]
})
export class AppModule { }


@NgModule({
  declarations: [
    ViewproductsComponent,
    DashboardComponent,
    TransactionComponent,
    ReportsComponent,  
    AgentDynamicFormComponent, 
    ProposalsComponent,
    RenewalDynamicFormComponent,
    ClaimsComponent,
    ClaimsViewComponent,
    ClaimsListViewComponent,
    RenewalListComponent,
    DatepipePipe,
    AbhiDashboardComponent,
    GetQuoteComponent,
    SubQuotesComponent,
    LeadsListComponent,
    ProposalsListComponent,
    CustomerListComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    NgxSliderModule,
    ReactiveFormsModule,
    BancassureRoutingModule,
    NgxPaginationModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatMenuModule,
    MyMaterialModule,
    EndorsementsModule
  ]
})
export class BancassureModule { }
