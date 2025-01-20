import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalsListComponent } from './proposals-list/proposals-list.component';
import { ProposalShareConsentComponent } from './proposal-share-consent/proposal-share-consent.component';
import { ProposalSummaryComponent } from './proposal-summary/proposal-summary.component';

const routes: Routes = [
  {path:"proposalsList",component:ProposalsListComponent},
  {path:"shareconstent",component:ProposalShareConsentComponent},
  {path:"shareSummary",component:ProposalSummaryComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalsRoutingModule { }
