import { Component, OnInit, ViewChild } from "@angular/core";
import { CalendarEventTimesChangedEvent } from "angular-calendar";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks
} from "date-fns";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { EventsService } from "../events-new/events.service";
import { MatDialog } from "@angular/material/dialog";
import { CalendarEvent, CalendarView } from "src/app/interface/events.interface";
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import * as $ from 'jquery';


@Component({
  selector: "app-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
})
export class EventsListComponent implements OnInit {
  view: CalendarView = CalendarView.Day;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  notes: any;
  dayStartHour: any;
  dayEndHour: any;
  selectedEvent: any = null;
  currentEventIndex: number = 0;
  selectedMonthRecords: any = [];
  slickConfig = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  @ViewChild('eventModal') eventModal: any;
  @ViewChild('eventModalCarousel') eventModalCarousel: any;
  constructor(private route: Router, private eventsService: EventsService, private dialog: MatDialog, private languageService: LanguageService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.loadEvents();
  }

  loadEvents(): void {
    const agentCode = localStorage.getItem("agentCode");
    let getEventReq =
    {
      "agentCode": agentCode,
      "startDate": null,
      "endDate": null,
      "eventType": "",
      "eventNumber": "",
      "customerName": "",
      "mobileNumber": "",
      "pageNumber": 1,
      "pageSize": 10
    }

    this.eventsService.getEvents(getEventReq, agentCode).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.events = response.data.eventList.map((event: any) => {
            // For each event, process all scheduled times
            return event.eventSchedule.map((schedule: any) => {
              const startDateTime = this.parseDateTime(schedule.date, schedule.startTime);
              const endDateTime = this.parseDateTime(schedule.date, schedule.endTime);

              if (!startDateTime || !endDateTime) {
                console.error("Invalid date/time for event:", event);
                return null;
              }

              return {
                note: event.note,
                title: `${event.customerName} </br> ${event.activityType}  </br>  ${event.note}`,
                start: startDateTime,
                end: endDateTime,
                color: {
                  primary: "#1e90ff",
                  secondary: "#D1E8FF",
                },
                meta: {
                  customerName: event.customerName,
                  mobileNumber: event.mobileNumber,
                  activityType: event.activityType,
                  activityTitle: event.activityTitle
                }
              };
            });
          })
            // Flatten the array of arrays since we mapped event schedules
            .flat()
            // Remove any null events from invalid dates
            .filter((event: any) => event !== null);

          if (this.events.length > 0) {
            const startHours = this.events.map(event => event.start.getHours());
            const endHours = this.events.map(event => event.end.getHours());

            this.dayStartHour = Math.min(...startHours);
            this.dayEndHour = Math.max(...endHours);
          }

          this.refresh.next();
        } else {
          console.error("Error loading events:", response.message);
        }
      },
      (error: any) => {
        console.error("Error loading events:", error);
        this.refresh.next();
      }
    );
  }

  parseDateTime(date: string, time: string): Date | null {
    try {

      const cleanTime = time.split('.')[0];  // Remove any milliseconds from the time string if present
      const dateTimeStr = `${date}T${cleanTime}`; // Combine date and time
      const dateTime = new Date(dateTimeStr);

      if (isNaN(dateTime.getTime())) {      // Validate the parsed date
        console.error(`Invalid DateTime: ${dateTimeStr}`);
        return null;
      }
      return dateTime;
    } catch (error) {
      console.error("Error parsing date and time:", error);
      return null;
    }
  }

  capitalizeFirstLetter(view: CalendarView): string {
    return view.charAt(0).toUpperCase() + view.slice(1).toLowerCase();
  }
  setView(selectedView: CalendarView): void {
    this.view = selectedView;
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

  handleEventClick(event: any) {
    console.log(event.event);

    this.selectedEvent = event.event;
    this.openEventModal();
  }
  // handleEventClick(eventInfo: { event: any }) {
  //   const selectedEvents = this.events.filter(
  //     (event) =>
  //       event.start.getDate() === eventInfo.event.start.getDate() &&
  //       event.start.getMonth() === eventInfo.event.start.getMonth() &&
  //       event.start.getFullYear() === eventInfo.event.start.getFullYear()
  //   );

  //   if (selectedEvents.length > 0) {
  //     let selectedIndex = selectedEvents.findIndex(
  //       (event) => event === eventInfo.event
  //     );
  //     selectedIndex = (selectedIndex + 1) % selectedEvents.length;
  //     this.selectedEvent = selectedEvents[selectedIndex];
  //     this.openEventModal();
  //   }
  // }
  // handleDayClick(eventInfo:any){
  //   console.log(eventInfo.day.events,'data')
  //   const selectedEvents = this.events.filter(
  //     (event) =>
  //       event.start.getDate() === eventInfo.day.events.start.getDate() &&
  //       event.start.getMonth() === eventInfo.day.events.start.getMonth() &&
  //       event.start.getFullYear() === eventInfo.day.events.start.getFullYear()
  //   );

  //   if (selectedEvents.length > 0) {
  //     let selectedIndex = selectedEvents.findIndex(
  //       (event) => event === eventInfo.event
  //     );
  //     selectedIndex = (selectedIndex + 1) % selectedEvents.length;
  //     this.selectedEvent = selectedEvents[selectedIndex];
  //     this.openEventModal();
  //   }
  // }
  addSlide() {
    this.events.push(this.eventModalCarousel);
  }
  removeSlide() {
    this.events.length = this.events.length - 1;
  }
  slickInit(e: any) {
    console.log('slick initialized');
  }
  breakpoint(e: any) {
    console.log('breakpoint');
  }
  afterChange(e: any) {
    console.log('afterChange');
  }
  beforeChange(e: any) {
    console.log('beforeChange');
  }
  handleDayClick(eventInfo: any): void {
    let selectedEvents: any = eventInfo.day.events;
    if (selectedEvents.length > 0) {
      this.selectedMonthRecords = selectedEvents;
      console.log(this.selectedMonthRecords, ' this.selectedMonthRecords')
      this.openEventCarousalModal();
    }
  }
  openEventModal(): void {
    this.dialog.open(this.eventModal, {
      width: '350px',
      position: { top: '150px' },
      disableClose: true,
    });
  }
  openEventCarousalModal(): void {
    this.dialog.open(this.eventModalCarousel, {
      width: '350px',
      position: { top: '150px' },
      disableClose: true,
    });
  }

  handleEventTimesChanged(
    changeInfo: CalendarEventTimesChangedEvent<any>
  ): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === changeInfo.event) {
        return {
          ...iEvent,
          start: changeInfo.newStart,
          end: changeInfo.newEnd ?? new Date(),
        };
      }
      return iEvent;
    });
    this.refresh.next();
  }

  addEvents() {
    this.route.navigate(["events/createEvents"]);
  }

  navigateToBirthdays() {
    this.route.navigate(["events/birthdaysList"]);
  }
  navigateToEventsList() {
    this.route.navigate(["events/eventsListView"]);
  }
}