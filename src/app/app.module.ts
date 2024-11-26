import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from './material.module';
import { PrimeNgModule } from './prime-ng.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { DatePipe } from '@angular/common';
import { TokenInterceptor } from './intercepter/token.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './layout/header/header.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { LoginModule } from './login/login/login.module';
import { DashboardModule } from './dashboard/dashboard/dashboard.module';
import { ClaimsViewModule } from './claims/claims-view/claims-view.module';
import { ProductsModule } from './product/products/products.module';
import { LeadsModule } from './leads/leads.module';
import { ProfileModule } from './profile/profile.module';
import { EncryptionInterceptor } from './intercepter/aesEncryptToken.interceptor';
import { LoadingService } from './services/loading.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from './shared/shared.module';

export function loadConfig(configService: ConfigService) {
  return () => configService.loadConfig();
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavbarComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    PrimeNgModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgToastModule,
    LoginModule,
    DashboardModule,
    ClaimsViewModule,
    LeadsModule,
    ProductsModule,
    ProfileModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ConfigService,
    LoadingService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true,
    },
    DatePipe,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:EncryptionInterceptor,
      multi:true
    },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
