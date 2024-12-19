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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { BirthdayWishesComponent } from '../birthday-wishes/birthday-wishes.component';
import { EventsListTableViewComponent } from '../events-list-table-view/events-list-table-view.component';
import { EventsEditViewComponent } from '../events-edit-view/events-edit-view.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
@NgModule({
  declarations: [EventsListComponent, EventsNewComponent, BirthdayWishesComponent, EventsListTableViewComponent, EventsEditViewComponent],
  imports: [
    CommonModule,
    MyMaterialModule,
    EventsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [DatePipe]
})
export class EventsModule { }