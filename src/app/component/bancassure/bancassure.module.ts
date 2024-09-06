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
import { AgentDynamicFormComponent } from './agent-dynamic-form/agent-dynamic-form.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { QuotesComponent } from '../renewals/quotes/quotes.component';
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
import { EndorsementsModule } from './endorsements/endorsements.module';

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
    QuotesComponent,
    RenewalDynamicFormComponent,
    ClaimsComponent,
    ClaimsViewComponent,
    ClaimsListViewComponent
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
    MatMenuModule,
    MyMaterialModule,
    EndorsementsModule
  ]
})
export class BancassureModule { }
