import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbhiupRoutingModule } from './abhi-up.routing-module';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { AbhiupComponent } from './abhi-up.component';
import { AbhiHeaderComponent } from './abhi-header/abhi-header.component';
import { AbhiNavbarComponent } from './abhi-navbar/abhi-navbar.component';
import { AbhiDynamicFormComponent } from './abhi-dynamic-form/abhi-dynamic-form.component';
import { AbhiDashboardComponent } from './abhi-dashboard/abhi-dashboard.component';

@NgModule({
  declarations: [
    AbhiupComponent,
    AbhiHeaderComponent,
    AbhiNavbarComponent,
    AbhiDynamicFormComponent,
    AbhiDashboardComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    AbhiupRoutingModule,
  ]
})
export class AbhiupModule { }
