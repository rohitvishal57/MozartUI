import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateLeadComponent } from './create-lead/create-lead.component';
import { UploadLeadComponent } from './upload-lead/upload-lead.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { NewCampaignRuleComponent } from './new-campaign-rule/new-campaign-rule.component';

const routes: Routes = [
  { path: "leadsList", component: LeadsListComponent },
  { path: "createLead", component: CreateLeadComponent},
  { path: "updateLead/:id", component: CreateLeadComponent},
  { path: "uploadLead", component: UploadLeadComponent},
  { path: "campaignmanagment", component: CampaignsComponent},
  { path: "createCampaign", component: NewCampaignComponent},
  { path: "createRule", component: NewCampaignRuleComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
