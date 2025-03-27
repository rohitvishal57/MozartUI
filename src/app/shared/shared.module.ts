import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModalComponent } from './components/shared-modal/shared-modal.component';
import { MyMaterialModule } from '../material.module';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { BankbranchModalComponent } from './components/bankbranch-modal/bankbranch-modal.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SuccessErrorModalComponent } from './components/success-error-modal/success-error-modal.component';
import { MyTableComponent } from './components/my-table/my-table.component';

@NgModule({
  declarations: [
    SharedModalComponent, ConfirmModalComponent, BankbranchModalComponent, FileUploadComponent, SuccessErrorModalComponent, MyTableComponent],
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MyMaterialModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModalComponent,
    ConfirmModalComponent,
    FileUploadComponent,
    MyTableComponent,
    MyMaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }