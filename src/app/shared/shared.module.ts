import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedTableComponent } from './components/shared-table/shared-table.component';

@NgModule({
  declarations : [SharedTableComponent],
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