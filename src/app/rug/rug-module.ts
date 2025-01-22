import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";
import { PrimeNgModule } from "../prime-ng.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { RugRoutingModule } from "./rug-routing.module";
import { OtpPopupComponent } from './otp-popup/otp-popup.component';
import { MyMaterialModule } from "../material.module";
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { CaptchaPopupComponent } from './captcha-popup/captcha-popup.component';
import { ViewLeadsComponent } from "./components/view-leads/view-leads.component";
import { ProductDownloadComponent } from "./components/product-download/product-download.component";
import { SafeUrlPipe } from "./components/product-download/safe-url.pipe";
import { D2cTestPageComponent } from './d2c-test-page/d2c-test-page.component';
import { BbTestPageComponent } from './bb-test-page/bb-test-page.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateAVComponent } from "./Admin/AV_Upload/create-av/create-av.component";
import { AVListComponent } from "./Admin/AV_Upload/av-list/av-list.component";
import { BulkUploadComponent } from "./Admin/AV_Upload/bulk-upload/bulk-upload.component";
import { ViewMakerCheckerLeadsComponent } from './components/view-maker-checker-leads/view-maker-checker-leads.component';
import { ViewForSoloJourneyComponent } from "./Admin/View_For_Solo_Journey/view-for-solo-journey/view-for-solo-journey.component";
import { CreateBasecallerComponent } from "./Admin/basecaller-upload/create-basecaller/create-basecaller.component";
import { BulkUploadBasecallerComponent } from "./Admin/basecaller-upload/bulk-upload-basecaller/bulk-upload-basecaller.component";
import { BasecallerListComponent } from "./Admin/basecaller-upload/basecaller-list/basecaller-list.component";
import { ViewUnverifiedLeadsComponent } from "./Admin/View_Unverified_Leads/view-unverified-leads/view-unverified-leads.component";
import { ViewForDualJourneyComponent } from "./Admin/View_For_Dual_Journey/view-for-dual-journey/view-for-dual-journey.component";
import { ReassignpopupComponent } from "./Admin/View_For_Solo_Journey/reassignpopup/reassignpopup.component";
import { AuditpopupComponent } from "./components/auditpopup/auditpopup.component";
import { SuccesspopupComponent } from "./components/successpopup/successpopup.component";
import { ProductDetailsComponent } from "./Admin/Product_Details/product-details/product-details.component";
import { ProposalPolicyViewDetailsComponent } from "./Admin/Proposal_Policy_View_Details/proposal-policy-view-details/proposal-policy-view-details.component";
import { ManageLobComponent } from "./Admin/manage-lob/manage-lob.component";


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    declarations: [RugDynamicFormComponent, OtpPopupComponent, PaymentInfoComponent, CaptchaPopupComponent, ViewLeadsComponent,
        ProductDownloadComponent,
        SafeUrlPipe,
        D2cTestPageComponent,
        BbTestPageComponent,
        CreateAVComponent,
        AVListComponent,
        BulkUploadComponent,
        ViewMakerCheckerLeadsComponent,
        ViewForSoloJourneyComponent,
        CreateBasecallerComponent,
        BulkUploadBasecallerComponent,
        BasecallerListComponent,
        ViewUnverifiedLeadsComponent,
        ViewForDualJourneyComponent,
        ReassignpopupComponent,
        AuditpopupComponent,
        SuccesspopupComponent,
        ProductDetailsComponent,
        ProposalPolicyViewDetailsComponent,
        ManageLobComponent
    ],
    
    imports: [
        CommonModule,
        PrimeNgModule,
        ClipboardModule,
        ReactiveFormsModule,
        RugRoutingModule,
        MyMaterialModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ]
})
export class RugModule { }