import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerJourneyComponent } from './customer-journey/customer-journey.component';

const routes: Routes = [
  {path:"customers/customersList",component:CustomersListComponent},
  {path:"yatra/customerPayment",component:CustomerJourneyComponent},
  {path:"yatra/customerKyc",component:CustomerJourneyComponent},
  {path:"renewal/customerPayment",component:CustomerJourneyComponent},
  {path:"renewal/customerKyc",component:CustomerJourneyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
