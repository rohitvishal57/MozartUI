import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { AbhiupComponent } from './abhi-up.component';
import { AbhiDynamicFormComponent } from './abhi-dynamic-form/abhi-dynamic-form.component';
import { AbhiDashboardComponent } from './abhi-dashboard/abhi-dashboard.component';

const routes: Routes = [
    {
      path: '',
      component: AbhiupComponent,
      children: [
        {path: "forms", component: AbhiDynamicFormComponent},
        {path:'',redirectTo:'forms',pathMatch:'full'},
        {path: "dashboard", component: AbhiDashboardComponent},
        // {path: "viewProposals", component: ProposalsComponent, canActivate: [AuthGuard]},
        // {path: "viewtransaction", component: TransactionComponent, canActivate: [AuthGuard]},
        // {path: "viewreports", component: ReportsComponent, canActivate: [AuthGuard]},
        // {path: "agentForm",component:AgentDynamicFormComponent,canActivate:[AuthGuard]}
      ]
    }
  ]
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AbhiupRoutingModule { }
  