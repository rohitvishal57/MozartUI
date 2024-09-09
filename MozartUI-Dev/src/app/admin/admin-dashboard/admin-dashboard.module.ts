import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { AdminDashboardRoutingModule } from './admin-dashboard.routing-module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ProductComponent } from './product/product/product.component';
import { ChannelInsuranceMapComponent } from './product-map/channel-insurance-map/channel-insurance-map.component';
import { ChannelInsuranceProductComponent } from './product-map/channel-insurance-product/channel-insurance-product.component';
import { UserDetailsComponent } from './bank-controller/user-details/user-details.component';
import { AddBankComponent } from './bank-controller/add-bank/add-bank.component';
import { AddChannelComponent } from './bank-controller/add-channel/add-channel.component';
import { InsuranceTypeComponent } from './bank-controller/insurance-type/insurance-type.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AgentDetailsComponent } from './bank-controller/agent-details/agent-details.component';
import { AddAgentComponent } from './bank-controller/add-agent/add-agent.component';
import { AgencyInsuranceMapComponent } from './product-map/agency-insurance-map/agency-insurance-map.component';
import { AgencyInsuranceProductMapComponent } from './product-map/agency-insurance-product-map/agency-insurance-product-map.component';

@NgModule({
    declarations: [
        AdminDashboardComponent,
        ProductComponent,
        ChannelInsuranceMapComponent,
        ChannelInsuranceProductComponent,
        UserDetailsComponent,
        AddBankComponent,
        AddChannelComponent,
        InsuranceTypeComponent,
        EditFormComponent,
        AgentDetailsComponent,
        AddAgentComponent,
        AgencyInsuranceMapComponent,
        AgencyInsuranceProductMapComponent
    ],
    imports:[
        CommonModule,
        PrimeNgModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        AdminDashboardRoutingModule,
        NgJsonEditorModule
    ]
})
export class AdminDashboardModule {}