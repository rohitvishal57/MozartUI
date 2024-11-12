import { Component, OnInit } from '@angular/core';
import { CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent as CE } from 'angular-calendar';
import { Router } from '@angular/router';
import { EventsService } from '../events-new/events.service';

export interface CalendarEvent extends CE {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color?: {
    primary: string;
    secondary: string;
  };
  allDay?: boolean;
  meta?: any;
}

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  view: CalendarView = CalendarView.Day;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();

  constructor(private route: Router, private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const agentCode = localStorage.getItem('agentCode')
    let getEventReq = [

      {
        "agentCode": agentCode,
        "customerName": "",
    
        "mobileNumber": "",
    
        "activityTitle": "",
    
        "startDate": "",
    
        "endDate": "",
    
        "activityType": "",
    
        "note": ""
    
      }
    
    ]
     
    this.eventsService.getEvents(getEventReq, agentCode).subscribe(
      (response:any) => {
        if (response.isSuccess) {
          const data = JSON.parse(response.data.data);
          this.events = data.map((event: any) => ({
            id: event.id,
            title: event.activityType,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            color: {
              primary: '#1e90ff',
              secondary: '#D1E8FF'
            },
            meta: {
              note: event.note
            }
          }));
          this.refresh.next();
        } else {
          console.error('Error loading events:', response.message);
          // Fallback to static events in case of API error
          // this.events = this.staticEvents;
          this.refresh.next();
        }
      },
      (error) => {
        console.error('Error loading events:', error);
        // Fallback to static events in case of API error
        // this.events = this.staticEvents;
        this.refresh.next();
      }
    );
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  today(): void {
    this.viewDate = new Date();
  }

  previousDate(): void {
    switch (this.view) {
      case CalendarView.Day:
        this.viewDate = subDays(this.viewDate, 1);
        break;
      case CalendarView.Week:
        this.viewDate = subWeeks(this.viewDate, 1);
        break;
      case CalendarView.Month:
        this.viewDate = subMonths(this.viewDate, 1);
        break;
    }
  }

  nextDate(): void {
    switch (this.view) {
      case CalendarView.Day:
        this.viewDate = addDays(this.viewDate, 1);
        break;
      case CalendarView.Week:
        this.viewDate = addWeeks(this.viewDate, 1);
        break;
      case CalendarView.Month:
        this.viewDate = addMonths(this.viewDate, 1);
        break;
    }
  }

  handleEventClick(eventClickInfo: { event: CE<any>; sourceEvent: MouseEvent | KeyboardEvent }): void {
    console.log('Event clicked:', eventClickInfo.event);
    console.log('Source event:', eventClickInfo.sourceEvent);
    // Additional logic for handling event click
  }

  handleEventTimesChanged(changeInfo: CalendarEventTimesChangedEvent<any>): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === changeInfo.event) {
        return {
          ...iEvent,
          start: changeInfo.newStart,
          end: changeInfo.newEnd ?? new Date()
        };
      }
      return iEvent;
    });
    this.refresh.next();
  }

  addEvents() {
    this.route.navigate(['events/createEvents']);
  }
}