import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyMaterialModule } from 'src/app/material.module';
import { SendOtpViaComponent } from '../send-otp-via/send-otp-via.component';
import { StatusValidationComponent } from '../status-validation/status-validation.component';

@NgModule({
  declarations: [LoginComponent,SendOtpViaComponent, StatusValidationComponent],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    MyMaterialModule,
    LoginRoutingModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule { }
