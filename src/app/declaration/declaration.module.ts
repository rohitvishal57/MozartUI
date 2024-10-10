import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeclarationRoutingModule } from './declaration-routing.module';
import { DeclarationComponent } from './declaration/declaration.component';


@NgModule({
  declarations: [
    DeclarationComponent
  ],
  imports: [
    CommonModule,
    DeclarationRoutingModule
  ]
})
export class DeclarationModule { }
