import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { EventsNewComponent } from './events-new.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventsListComponent } from '../events-list/events-list.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MyMaterialModule } from 'src/app/material.module';
@NgModule({
  declarations: [EventsListComponent, EventsNewComponent],
  imports: [
    CommonModule,
    MyMaterialModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [DatePipe]
})
export class EventsModule { }