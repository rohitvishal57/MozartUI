import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { RenewalDynamicFormComponent } from './renewal-dynamic-form/renewal-dynamic-form.component';
import { SubQuotesComponent } from './sub-quotes/sub-quotes.component';

const routes: Routes = [
  { path: "renewalList", component: RenewalListComponent },
  { path: "renewalDynamicForm", component: RenewalDynamicFormComponent },
  { path: "subquotes", component: SubQuotesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewalsRoutingModule { }
