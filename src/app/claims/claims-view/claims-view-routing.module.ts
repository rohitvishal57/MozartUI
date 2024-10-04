import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsListViewComponent } from '../claims-list-view/claims-list-view.component';
import { ClaimsViewComponent } from './claims-view.component';

const routes: Routes = [
  { path: "claimsList", component: ClaimsListViewComponent },
  { path: "createClaims", component: ClaimsViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
