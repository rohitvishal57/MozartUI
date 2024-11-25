import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { UploadPerformaceComponent } from './upload-performace/upload-performace.component';
import { MyMaterialModule } from '../material.module';
import { MyPerformaceComponent } from './my-performace/my-performace.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyPerformaceComponent,
    UploadPerformaceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PerformanceRoutingModule,
    MyMaterialModule,
  ]
})
export class PerformanceModule { }
