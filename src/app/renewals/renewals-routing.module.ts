import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { RenewalDynamicFormComponent } from './renewal-dynamic-form/renewal-dynamic-form.component';
import { SubQuotesComponent } from './sub-quotes/sub-quotes.component';
import { PaymentstatusComponent } from './paymentstatus/paymentstatus.component';

const routes: Routes = [
  { path: "renewalList", component: RenewalListComponent },
  { path: "payment", component: RenewalDynamicFormComponent },
  { path: "quote", component: SubQuotesComponent },
  {path:"paymentstatus",component:PaymentstatusComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewalsRoutingModule { }
