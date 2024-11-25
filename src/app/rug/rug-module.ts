import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";
import { PrimeNgModule } from "../prime-ng.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RugRoutingModule } from "./rug-routing.module";
import { OtpPopupComponent } from './otp-popup/otp-popup.component';
import { MyMaterialModule } from "../material.module";
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { CaptchaPopupComponent } from './captcha-popup/captcha-popup.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
    declarations:[RugDynamicFormComponent, OtpPopupComponent, PaymentInfoComponent, CaptchaPopupComponent],
    imports:[
        CommonModule,
        PrimeNgModule,
        ClipboardModule,
        ReactiveFormsModule,
        RugRoutingModule,
        MyMaterialModule,
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