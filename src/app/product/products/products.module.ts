import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComparisonComponent } from './product-comparison/product-comparison.component';

@NgModule({
  declarations: [ProductsComponent, ProductComparisonComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
