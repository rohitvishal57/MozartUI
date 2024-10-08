import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalsListComponent } from './proposals-list/proposals-list.component';

const routes: Routes = [
  {path:"proposalsList",component:ProposalsListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalsRoutingModule { }
