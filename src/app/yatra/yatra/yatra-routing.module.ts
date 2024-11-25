import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YatraComponent } from './yatra.component';

const routes: Routes = [
  { path:'', component: YatraComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YatraRoutingModule { }
