import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { QuoteProductsComponent } from './quote-products/quote-products.component';
import { CreateLeadComponent } from '../leads/create-lead/create-lead.component';
import { AuthGuard } from 'src/app/authorize/auth.guard';

const routes: Routes = [
  { path: "productDetails", component: ProductDetailsComponent },
  { path: "quoteProducts", component: QuoteProductsComponent},
  { path: "createLead", component: CreateLeadComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }
