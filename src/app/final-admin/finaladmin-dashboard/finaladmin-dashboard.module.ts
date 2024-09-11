import { NgModule } from "@angular/core";
import { FinaladminDashboardComponent } from "./finaladmin-dashboard.component";
import { CommonModule } from "@angular/common";
import { PrimeNgModule } from "src/app/prime-ng.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { ReactiveFormsModule } from "@angular/forms";
import { NgJsonEditorModule } from "ang-jsoneditor";
import { FinalAdminDashboardRoutingModule } from "./finaladmin-dashboard.routing-module";
import { FinaladminTablesComponent } from "../finaladmin-tables/finaladmin-tables.component";
import { EditFormComponent } from "../finaladmin-forms/edit-form/edit-form.component";
import { DndModule } from "ngx-drag-drop";
import { FormPreviewComponent } from "../finaladmin-forms/form-preview/form-preview.component";
import { FormSequenceComponent } from "../finaladmin-forms/form-sequence/form-sequence.component";
import { AddBankComponent } from "../finaladmin-controller/add-bank/add-bank.component";
import { AddChannelComponent } from "../finaladmin-controller/add-channel/add-channel.component";
import { AddProductComponent } from "../finaladmin-controller/add-product/add-product.component";
import { InsuranceTypeComponent } from "../finaladmin-controller/insurance-type/insurance-type.component";
import { UserDetailsComponent } from "../finaladmin-controller/user-details/user-details.component";
import { AddAgentComponent } from "../finaladmin-controller/add-agent/add-agent.component";
import { AddAgencyComponent } from "../finaladmin-controller/add-agency/add-agency.component";




@NgModule({
  declarations: [
    FinaladminDashboardComponent,
    FinaladminTablesComponent,
    EditFormComponent,
    FormPreviewComponent,
    FormSequenceComponent,
    AddBankComponent,
    AddChannelComponent,
    AddProductComponent,
    InsuranceTypeComponent,
    UserDetailsComponent,
    AddAgentComponent,
    AddAgencyComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FinalAdminDashboardRoutingModule,
    NgJsonEditorModule,
    DndModule
  ]
})
export class FinaladminDashboardModule { }
