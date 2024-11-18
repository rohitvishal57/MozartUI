import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModalComponent } from './components/shared-modal/shared-modal.component';
import { MyMaterialModule } from '../material.module';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    SharedModalComponent, ConfirmModalComponent],
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
    MyMaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }