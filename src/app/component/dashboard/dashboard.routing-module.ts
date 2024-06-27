import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'src/app/authorize/auth.guard';
import { ProductsComponent } from './products/products.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { BancaAgentDashboardComponent } from './banca-agent-dashboard/banca-agent-dashboard.component';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path:"dashboard",component: BancaAgentDashboardComponent, canActivate:[AuthGuard]
      },
      {
        path: "products", component: ProductsComponent, canActivate: [AuthGuard]
      },
      {
        path: "dynamicForm", component: DynamicFormComponent, canActivate: [AuthGuard]
      },
      {
        path: "customerForm", component: CustomerFormComponent, canActivate: [AuthGuard]
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
