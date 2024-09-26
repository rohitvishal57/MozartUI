import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndorsementsRequestsComponent } from './endorsements-requests/endorsements-requests.component';
import { EndorsementsNewRequestComponent } from './endorsements-new-request/endorsements-new-request.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  { path: '', component: EndorsementsRequestsComponent },
  { path: 'new-request', component: EndorsementsNewRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ModalModule.forRoot(),],
  exports: [RouterModule],
  providers: [BsModalService]
})
export class EndorsementsRoutingModule { }
