import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsListComponent } from '../events-list/events-list.component';
import { EventsNewComponent } from './events-new.component';

const routes: Routes = [
  { path: "eventsList", component: EventsListComponent },
  { path: "createEvents", component: EventsNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
