import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductComparisonComponent } from './product-comparison/product-comparison.component';

const routes: Routes = [
  {path:'',component:ProductsComponent},
  { path: "comparison", component: ProductComparisonComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
