import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PrimeNgModule } from '../prime-ng.module';
import { MyMaterialModule } from '../material.module';
import { CreateLeadComponent } from './create-lead/create-lead.component';
import { CreateLead } from './CreateLead';
import { LeadFormListValue } from './leadFormListValue';
import { UploadLeadComponent } from './upload-lead/upload-lead.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { NewCampaignRuleComponent } from './new-campaign-rule/new-campaign-rule.component';


@NgModule({
  declarations: [
    LeadsListComponent,
    CreateLeadComponent,
    UploadLeadComponent,
    CampaignsComponent,
    NewCampaignComponent,
    NewCampaignRuleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    LeadsRoutingModule,
    PrimeNgModule,
    MyMaterialModule,
    FormsModule
  ],
  providers: [CreateLead, LeadFormListValue],
})
export class LeadsModule { }
