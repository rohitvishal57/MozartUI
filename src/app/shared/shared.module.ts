import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations : [SharedTableComponent, FileUploadComponent],
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
  ],
  exports:[
    FormsModule,
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    SharedTableComponent
  ]
})
export class SharedModule { }