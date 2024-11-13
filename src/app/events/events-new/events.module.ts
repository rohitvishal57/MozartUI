import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { EventsNewComponent } from './events-new.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventsListComponent } from '../events-list/events-list.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EventsListComponent, EventsNewComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class EventsModule { }