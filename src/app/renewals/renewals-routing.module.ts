import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { RenewalDynamicFormComponent } from './renewal-dynamic-form/renewal-dynamic-form.component';
import { SubQuotesComponent } from './sub-quotes/sub-quotes.component';
import { PaymentstatusComponent } from './paymentstatus/paymentstatus.component';
import { RenewalJourneyComponent } from './renewal-journey/renewal-journey.component';
import { KycStatusComponent } from './kyc-status/kyc-status.component';

const routes: Routes = [
  { path: "renewalList", component: RenewalListComponent },
  { path: "payment", component: RenewalDynamicFormComponent },
  { path: "renewalJourney", component: RenewalJourneyComponent},
  { path: "quote", component: SubQuotesComponent },
  { path: "paymentstatus",component:PaymentstatusComponent},
  { path: "customerRenewalJourney",component:RenewalJourneyComponent},
  { path: "kycStatus",component:KycStatusComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewalsRoutingModule { }
