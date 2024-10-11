import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPerformaceComponent } from './my-performace/my-performace.component';
import { UploadPerformaceComponent } from './upload-performace/upload-performace.component';

const routes: Routes = [
  { path: "my-performance", component: MyPerformaceComponent },
  { path: "upload-perfomance", component: UploadPerformaceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
