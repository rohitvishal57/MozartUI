import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndorsementsRequestsComponent } from './endorsements-requests.component';
import { EndorsementsNewRequestComponent } from '../endorsements-new-request/endorsements-new-request.component';
import { EndorsementDetailsComponent } from '../endorsement-details/endorsement-details.component';

const routes: Routes = [
  { path: '', component: EndorsementsRequestsComponent },
  { path: "new-request", component: EndorsementsNewRequestComponent },
  { path: "endorsemet-details/:id", component: EndorsementDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndorsementsRoutingModule { }
