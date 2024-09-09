import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { DashboardRoutingModule } from './dashboard.routing-module';
import { DashboardComponent } from './dashboard.component';
import { ProductsComponent } from './products/products.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { HeaderComponent } from 'src/app/portal/header/header.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { BancaAgentDashboardComponent } from './banca-agent-dashboard/banca-agent-dashboard.component';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';
import { FooterComponent } from 'src/app/portal/footer/footer.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ProductsComponent,
        DynamicFormComponent,
        HeaderComponent,
        CustomerFormComponent,
        BancaAgentDashboardComponent,
        DashboardSidebarComponent,
        FooterComponent
    ],
    imports:[
        CommonModule,
        DashboardRoutingModule,
        PrimeNgModule,
        NgxSpinnerModule,
        ReactiveFormsModule 
    ]
})
export class DashboardModule { }