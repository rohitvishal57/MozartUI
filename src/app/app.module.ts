import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyMaterialModule } from './material.module';
import { PrimeNgModule } from './prime-ng.module';
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { LoginComponent } from './component/login/login.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { PortalModule } from './portal/portal.module';
import {NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { BankLoginComponent } from './component/bank-login/bank-login.component';
import { BancassureComponent } from './component/bancassure/bancassure.component';
import { AgentLoginComponent } from './component/bancassure/agent-login/agent-login.component';
import { DndModule } from 'ngx-drag-drop';
import { TokenInterceptor } from './intercepter/token.interceptor';
import {BrowserUtils, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { ADConfig } from 'src/configuration';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { withDisabledInitialNavigation, withEnabledBlockingInitialNavigation } from '@angular/router';

// Form MSAL Login
export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: ADConfig.msalConfig.auth.clientId,
      authority: ADConfig.msalConfig.auth.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/'
    },
    system: {
      allowNativeBroker: false, 
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(ADConfig.apiConfig.uri, ADConfig.apiConfig.scopes);
  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...ADConfig.apiConfig.scopes]
    },
    loginFailedRoute: '/login'
  };
}

const initialNavigation = !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
  ? withEnabledBlockingInitialNavigation() 
  : withDisabledInitialNavigation();

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLoginComponent,
    BancassureComponent,
    BankLoginComponent,
    AgentLoginComponent
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
    NgxSpinnerModule,
    DndModule,
    PortalModule,
    MsalModule
  ],
  providers: [
    DatePipe,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  schemas: [],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
