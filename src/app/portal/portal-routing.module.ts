import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { PortalComponent } from './portal.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: "",
    component: PortalComponent,
    children: [
      {
        path: 'banca',
        loadChildren: () => import('../component/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'adminDashboard',
        loadChildren: () => import('../admin/admin-dashboard/admin-dashboard.module').then((m) => m.AdminDashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'finaladminDashboard',
        loadChildren: () => import('../final-admin/finaladmin-dashboard/finaladmin-dashboard.module').then((m) => m.FinaladminDashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'agent',
        loadChildren: () => import('../component/bancassure/bancassure.module').then((m) => m.BancassureModule),
        canActivate: [AuthGuard]
      }, 
      {
        path: "abhi",
        loadChildren: () => import('../component/abhi-up/abhi-up.module').then((m) => m.AbhiupModule)
      },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoute { }
