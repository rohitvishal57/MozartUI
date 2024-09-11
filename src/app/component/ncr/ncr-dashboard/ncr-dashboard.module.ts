import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NcrDashboardRoutingModule } from './ncr-dashboard-routing.module';
import { NcrDashboardComponent } from './ncr-dashboard.component';
import { ServiceScreenComponent } from './service-screen/service-screen.component';
import { NcrDynamicFormComponent } from './ncr-dynamic-form/ncr-dynamic-form.component';
import { ShowDataTableComponent } from './show-data-table/show-data-table.component';

@NgModule({
    declarations: [
        NcrDashboardComponent,
        ServiceScreenComponent,
        NcrDynamicFormComponent,
        ShowDataTableComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        NcrDashboardRoutingModule
    ]
})
export class NcrDashboardModule{ 
}
