import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', 
    loadChildren:() => import('./login/login/login.module').then((m)=>m.LoginModule)
   },
   { path: 'dashboard', 
    loadChildren:() => import('./dashboard/dashboard/dashboard.module').then((m)=>m.DashboardModule)
   },
   { path: 'leads', 
   loadChildren:() => import('./leads/leads.module').then((m)=>m.LeadsModule)
   },
   { path: 'claims', 
    loadChildren:() => import('./claims/claims-view/claims-view.module').then((m)=>m.ClaimsViewModule)
   },
   { path: 'endorsements', 
    loadChildren:() => import('./endorsements/endorsements-requests/endorsements-requests.module').then((m)=>m.EndorsementsRequestsModule)
   },
   { path: 'products', 
    loadChildren:() => import('./product/products/products.module').then((m)=>m.ProductsModule)
   },
   { path: 'quote', 
    loadChildren:() => import('./quote/quote.module').then((m)=>m.QuoteModule)
   },
   { path: 'yatra', 
    loadChildren:() => import('./yatra/yatra/yatra.module').then((m)=>m.YatraModule)
   },
   { path: 'renewals', 
    loadChildren:() => import('./renewals/renewals.module').then((m)=>m.RenewalsModule)
   },
   {path:'leads',
    loadChildren:() => import("./leads/leads.module").then((m)=>m.LeadsModule)
   },
   {path:'customers',
    loadChildren:() => import("./customers/customers.module").then((m)=>m.CustomersModule)
   },
   {path:'proposals',
    loadChildren:() => import("./proposals/proposals.module").then((m)=>m.ProposalsModule)
   },
   {path:'declaration',
    loadChildren:() => import("./declaration/declaration.module").then((m)=>m.DeclarationModule)
   },
   {
    path:'performance',
    loadChildren:() => import("./performance/performance.module").then((m)=>m.PerformanceModule)
   },
  {path:'**',redirectTo:'',pathMatch:'full'}

];

@NgModule({
imports: [RouterModule.forRoot(routes, {useHash: true})], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
