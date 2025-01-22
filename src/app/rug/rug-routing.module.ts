import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";
import { ViewLeadsComponent } from "./components/view-leads/view-leads.component";
import { ProductDownloadComponent } from "./components/product-download/product-download.component";
import { BbTestPageComponent } from "./bb-test-page/bb-test-page.component";
import { D2cTestPageComponent } from "./d2c-test-page/d2c-test-page.component";
import { AVListComponent } from "./Admin/AV_Upload/av-list/av-list.component";
import { CreateAVComponent } from "./Admin/AV_Upload/create-av/create-av.component";
import { ViewForSoloJourneyComponent } from "./Admin/View_For_Solo_Journey/view-for-solo-journey/view-for-solo-journey.component";
import { ViewUnverifiedLeadsComponent } from "./Admin/View_Unverified_Leads/view-unverified-leads/view-unverified-leads.component";
import { ViewForDualJourneyComponent } from "./Admin/View_For_Dual_Journey/view-for-dual-journey/view-for-dual-journey.component";
import { VerificationScriptComponent } from "./Admin/Verification_Script/verification-script/verification-script.component";
import { ExtractBaseAndAvMasterComponent } from "./Admin/Extract_Base_Agent_AV_Master/extract-base-and-av-master/extract-base-and-av-master.component";
import { ProposalPolicyViewDetailsComponent } from "./Admin/Proposal_Policy_View_Details/proposal-policy-view-details/proposal-policy-view-details.component";
import { BulkUploadComponent } from "./Admin/AV_Upload/bulk-upload/bulk-upload.component";
import { AuditComponent } from "./Admin/AV_Upload/audit/audit.component";
import { ViewMakerCheckerLeadsComponent } from "./components/view-maker-checker-leads/view-maker-checker-leads.component";
import { BasecallerListComponent } from "./Admin/basecaller-upload/basecaller-list/basecaller-list.component";
import { BulkUploadBasecallerComponent } from "./Admin/basecaller-upload/bulk-upload-basecaller/bulk-upload-basecaller.component";
import { CreateBasecallerComponent } from "./Admin/basecaller-upload/create-basecaller/create-basecaller.component";
import { ProductDetailsComponent } from "./Admin/Product_Details/product-details/product-details.component";
import { ManageLobComponent } from "./Admin/LOB/manage-lob/manage-lob.component";
import { CreateLobComponent } from "./Admin/LOB/create-lob/create-lob.component";



const routes: Routes = [
    { path:'', component: RugDynamicFormComponent },
    { path:'view-leads', component: ViewLeadsComponent },
    { path:'view-checker-leads', component: ViewMakerCheckerLeadsComponent },
    { path:'productdownload', component: ProductDownloadComponent },
    { path:'base-caller-upload', component: ProductDownloadComponent }, 
    { path:'extract-base-agent', component: ProductDownloadComponent },
    { path:'manage-LOB', component: ManageLobComponent },
    { path:'policy-view-details', component: ProductDownloadComponent },
    { path:'test-page', component: BbTestPageComponent },
    { path:'bb-test-page', component: BbTestPageComponent },
    {path:'basecaller',component:BasecallerListComponent},
    {path:'upload_basecaller',component:BulkUploadBasecallerComponent},
    {path:'create_baseCaller',component:CreateBasecallerComponent},
    {path:'update_baseCaller/:domainId',component:CreateBasecallerComponent},
    { path:'av-list', component:AVListComponent},
    { path:'bulk_upload', component:BulkUploadComponent},
    { path:'create_AV', component:CreateAVComponent},
    { path:'update_AV/:avId', component:CreateAVComponent},
    {path:'audit', component:AuditComponent},
    { path:'view-for-solo-journey', component:ViewForSoloJourneyComponent},
    {path:'view-unverified-leads', component:ViewUnverifiedLeadsComponent},
    {path:'view-for-dual-journey', component:ViewForDualJourneyComponent},
    {path:'verification_script', component: VerificationScriptComponent},
    {path:'product_details', component:ProductDetailsComponent},
    {path:'extract_base_agent_av_master', component:ExtractBaseAndAvMasterComponent},
    {path:'proposal_policy_view_details', component:ProposalPolicyViewDetailsComponent},
    {path:'create_LOB', component:CreateLobComponent},
    {path:'update_LOB/:lobName', component:CreateLobComponent}
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RugRoutingModule{}
