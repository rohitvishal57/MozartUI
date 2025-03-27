import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionstatementComponent } from './commissionstatement.component';

const routes: Routes = [
  { path: "commissionStatement", component: CommissionstatementComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionstatementRoutingModule { }
