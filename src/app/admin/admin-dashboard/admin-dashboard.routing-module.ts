import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AddBankComponent } from './bank-controller/add-bank/add-bank.component';
import { AddChannelComponent } from './bank-controller/add-channel/add-channel.component';
import { InsuranceTypeComponent } from './bank-controller/insurance-type/insurance-type.component';
import { UserDetailsComponent } from './bank-controller/user-details/user-details.component';
import { ProductComponent } from './product/product/product.component';
import { ChannelInsuranceMapComponent } from './product-map/channel-insurance-map/channel-insurance-map.component';
import { ChannelInsuranceProductComponent } from './product-map/channel-insurance-product/channel-insurance-product.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { AgentDetailsComponent } from './bank-controller/agent-details/agent-details.component';
import { AddAgentComponent } from './bank-controller/add-agent/add-agent.component';
import { AgencyInsuranceMapComponent } from './product-map/agency-insurance-map/agency-insurance-map.component';
import { AgencyInsuranceProductMapComponent } from './product-map/agency-insurance-product-map/agency-insurance-product-map.component';

const routes: Routes = [
  {
    path:'',
    component:AdminDashboardComponent,
    children:[
      {path:'addBank',component:AddBankComponent,canActivate:[AuthGuard]},
      {path:'addChannnel',component:AddChannelComponent,canActivate:[AuthGuard]},
      {path:'addInsuranceType',component:InsuranceTypeComponent,canActivate:[AuthGuard]},
      {path:'addUserDetails',component:UserDetailsComponent,canActivate:[AuthGuard]},
      {path:'addAgentDetails',component:AgentDetailsComponent,canActivate:[AuthGuard]},
      {path:'addAgency',component:AddAgentComponent,canActivate:[AuthGuard]},
      {path:'addProduct',component:ProductComponent,canActivate:[AuthGuard]},
      {path:'channelInsuranceMap',component:ChannelInsuranceMapComponent,canActivate:[AuthGuard]},
      {path:'channelInsuranceProductMap',component:ChannelInsuranceProductComponent,canActivate:[AuthGuard]},
      {path:'agencyInsuranceMap',component:AgencyInsuranceMapComponent,canActivate:[AuthGuard]},
      {path:'agencyInsuranceProductMap',component:AgencyInsuranceProductMapComponent,canActivate:[AuthGuard]},
      {path:'formConfiguration',component:EditFormComponent,canActivate:[AuthGuard]}
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
