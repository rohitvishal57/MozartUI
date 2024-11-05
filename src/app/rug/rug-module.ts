import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RugDynamicFormComponent } from "./rug-dynamic-form/rug-dynamic-form.component";
import { PrimeNgModule } from "../prime-ng.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from "ngx-spinner";
import { RugRoutingModule } from "./rug-routing.module";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
    declarations:[RugDynamicFormComponent],
    imports:[
        CommonModule,
        PrimeNgModule,
        ClipboardModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        RugRoutingModule,
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