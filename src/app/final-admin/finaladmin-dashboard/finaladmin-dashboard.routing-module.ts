import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { FinaladminDashboardComponent } from './finaladmin-dashboard.component';
import { EditFormComponent } from '../finaladmin-forms/edit-form/edit-form.component';
import { FormPreviewComponent } from '../finaladmin-forms/form-preview/form-preview.component';
import { FormSequenceComponent } from '../finaladmin-forms/form-sequence/form-sequence.component';
import { AddBankComponent } from '../finaladmin-controller/add-bank/add-bank.component';
import { AddChannelComponent } from '../finaladmin-controller/add-channel/add-channel.component';
import { FinaladminDashboardModule } from './finaladmin-dashboard.module';
import { AddProductComponent } from '../finaladmin-controller/add-product/add-product.component';
import { InsuranceTypeComponent } from '../finaladmin-controller/insurance-type/insurance-type.component';
import { UserDetailsComponent } from '../finaladmin-controller/user-details/user-details.component';
import { FinaladminTablesComponent } from '../finaladmin-tables/finaladmin-tables.component';
import { AddAgentComponent } from '../finaladmin-controller/add-agent/add-agent.component';
import { AddAgencyComponent } from '../finaladmin-controller/add-agency/add-agency.component';

const routes: Routes = [
  {
    path:'',
    component:FinaladminDashboardComponent,
    children:[
      {path:'addChannnel',component:AddChannelComponent,canActivate:[AuthGuard]},
      {path:'',component:FinaladminTablesComponent,canActivate:[AuthGuard]},
      {path:'addBank',component:AddBankComponent,canActivate:[AuthGuard]},
      {path:'addInsuranceType',component:InsuranceTypeComponent,canActivate:[AuthGuard]},
      {path:'addProduct',component:AddProductComponent,canActivate:[AuthGuard]},
      {path:'addUser',component:UserDetailsComponent,canActivate:[AuthGuard]},
      {path:'editForm',component:EditFormComponent,canActivate:[AuthGuard]},
      {path:'formSequence',component:FormSequenceComponent,canActivate:[AuthGuard]},
      {path:'formPreview',component:FormPreviewComponent,canActivate:[AuthGuard]},
      {path:'addAgent',component:AddAgentComponent,canActivate:[AuthGuard]},
      {path:'addAgency',component:AddAgencyComponent,canActivate:[AuthGuard]}
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalAdminDashboardRoutingModule { }
