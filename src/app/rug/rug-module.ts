import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";
import { PrimeNgModule } from "../prime-ng.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
    declarations:[RugDynamicFormComponent, OtpPopupComponent, PaymentInfoComponent, CaptchaPopupComponent, ViewLeadsComponent,
        ProductDownloadComponent,
        SafeUrlPipe,
        D2cTestPageComponent,
        BbTestPageComponent
    ],
    imports:[
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
export class RugModule{}