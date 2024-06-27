import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './authorize/auth.guard';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { BankLoginComponent } from './component/bank-login/bank-login.component';
import { BancassureComponent } from './component/bancassure/bancassure.component';
import { AgentLoginComponent } from './component/bancassure/agent-login/agent-login.component';
import { BrowserUtils } from '@azure/msal-browser';

const routes: Routes=[
  {path:"",component:LoginComponent},
  {path:"admin",component:AdminLoginComponent},
  {path:"agent",component:AgentLoginComponent},
  {path:"banca",component:BancassureComponent},
  {path:"login/:bankname",component:BankLoginComponent},
  {
    path:'portal',
    loadChildren: () => import('./portal/portal.module').then((m) => m.PortalModule  ),
    canActivate: [AuthGuard]
  },
  {path:'**',redirectTo:"",pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
