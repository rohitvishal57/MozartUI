import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsListComponent } from '../events-list/events-list.component';
import { EventsNewComponent } from './events-new.component';
import { BirthdayWishesComponent } from '../birthday-wishes/birthday-wishes.component';
import { EventsListTableViewComponent } from '../events-list-table-view/events-list-table-view.component';
import { EventsEditViewComponent } from '../events-edit-view/events-edit-view.component';

const routes: Routes = [
  { path: "eventsList", component: EventsListComponent },
  { path: "createEvents", component: EventsNewComponent },
  { path: "birthdaysList", component:BirthdayWishesComponent},
  {path: "eventsListView", component:EventsListTableViewComponent},
  {path: "editEvents/:id", component:EventsEditViewComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
