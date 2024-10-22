import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  exports:[
    FormsModule,
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }