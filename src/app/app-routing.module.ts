import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: '',
    loadChildren: () => import('./login/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'leads',
    loadChildren: () => import('./leads/leads.module').then((m) => m.LeadsModule)
  },
  {
    path: 'claims',
    loadChildren: () => import('./claims/claims-view/claims-view.module').then((m) => m.ClaimsViewModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events-new/events.module').then((m) => m.EventsModule)
  },
  {
    path: 'endorsements',
    loadChildren: () => import('./endorsements/endorsements-requests/endorsements-requests.module').then((m) => m.EndorsementsRequestsModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./product/products/products.module').then((m) => m.ProductsModule)
  },
  {
    path: 'quote',
    loadChildren: () => import('./quote/quote.module').then((m) => m.QuoteModule)
  },
  {
    path: 'yatra',
    loadChildren: () => import('./yatra/yatra/yatra.module').then((m) => m.YatraModule)
  },
  {
    path: 'rug',
    loadChildren: () => import('./rug/rug-module').then((m) => m.RugModule)
  },
  {
    path: 'renewal',
    loadChildren: () => import('./renewals/renewals.module').then((m) => m.RenewalsModule)
  },
  {
    path: 'leads',
    loadChildren: () => import("./leads/leads.module").then((m) => m.LeadsModule)
  },
  {
    path: 'customers',
    loadChildren: () => import("./customers/customers.module").then((m) => m.CustomersModule)
  },
  {
    path: 'proposals',
    loadChildren: () => import("./proposals/proposals.module").then((m) => m.ProposalsModule)
  },
  {
    path: 'profile',
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule)
  },
  {
    path: 'declaration',
    loadChildren: () => import("./declaration/declaration.module").then((m) => m.DeclarationModule)
  },
  {
    path: 'performance',
    loadChildren: () => import("./performance/performance.module").then((m) => m.PerformanceModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
