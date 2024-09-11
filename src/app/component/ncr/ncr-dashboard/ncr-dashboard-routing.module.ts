import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/authorize/auth.guard';
import { NcrDashboardComponent } from './ncr-dashboard.component';
import { ServiceScreenComponent } from './service-screen/service-screen.component';

const routes: Routes = [
    {
        path:'dashboard',
        component:NcrDashboardComponent,
        children:[
          {
            path:'',component:ServiceScreenComponent,canActivate:[authGuard]
          }
        ]
    }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NcrDashboardRoutingModule { }
