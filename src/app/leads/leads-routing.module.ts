import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadsListComponent } from './leads-list/leads-list.component';

const routes: Routes = [
  {path:"leadsList",component:LeadsListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
