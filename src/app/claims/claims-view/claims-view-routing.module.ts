import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsListViewComponent } from '../claims-list-view/claims-list-view.component';
import { ClaimsViewComponent } from './claims-view.component';
import { ClaimsDetailsComponent } from '../claims-details/claims-details.component';

const routes: Routes = [
  { path: "claimsList", component: ClaimsListViewComponent },
  { path: "createClaims", component: ClaimsViewComponent },
  { path: "detailsView/:id/:claimInfoId/:policyNumber", component: ClaimsDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
