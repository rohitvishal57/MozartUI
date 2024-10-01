import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { ViewproductsComponent } from './viewproducts/viewproducts.component';
import { BancassureComponent } from './bancassure.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ReportsComponent } from './reports/reports.component';
import { AgentDynamicFormComponent } from './agent-dynamic-form/agent-dynamic-form.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { RenewalDynamicFormComponent } from '../renewals/renewal-dynamic-form/renewal-dynamic-form.component';
import { ClaimsComponent } from './claims/claims.component';
import { ClaimsViewComponent } from './claims/claims-view/claims-view.component';
import { RenewalListComponent } from '../renewals/renewal-list/renewal-list.component';
import { SubQuotesComponent } from '../renewals/sub-quotes/sub-quotes.component';
import { LeadsListComponent } from '../leads/leads-list/leads-list.component';
import { ProposalsListComponent } from '../proposals/proposals-list/proposals-list.component';
import { CustomerListComponent } from '../customers/customer-list/customer-list.component';
import { StatusValidationComponent } from '../status-validation/status-validation.component';
import { ClaimsDetailsComponent } from './claims/claims-details/claims-details.component';


const routes: Routes = [
    {
      path: '',
      component: BancassureComponent,
      children: [
        {path: "viewproducts", component: ViewproductsComponent, canActivate: [AuthGuard]},
        {path: "viewdashboard", component: DashboardComponent, canActivate: [AuthGuard]},
        {path: "viewProposals", component: ProposalsListComponent, canActivate: [AuthGuard]},
        {path: "viewtransaction", component: TransactionComponent, canActivate: [AuthGuard]},
        {path: "viewreports", component: ReportsComponent, canActivate: [AuthGuard]},
        {path: "agentForm",component:AgentDynamicFormComponent,canActivate:[AuthGuard]},
        {path: "renewalList", component: RenewalListComponent},
        {path: "renewalDynamicForm", component: RenewalDynamicFormComponent},
        {path: "claimsList", component: ClaimsComponent},
        {path: "createClaims", component:ClaimsViewComponent},
        {path:"subquotes",component:SubQuotesComponent},
        {path:"leadsList",component:LeadsListComponent},
        {path: "viewcustomer",component:CustomerListComponent, canActivate:[AuthGuard]},
        {path: "claimsDetails/:id", component:ClaimsDetailsComponent},
        {
          path: "endorsements",
          loadChildren: () => import('../bancassure/endorsements/endorsements.module').then((m) => m.EndorsementsModule)
        },
      ]
    }
  ]
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BancassureRoutingModule { }
  