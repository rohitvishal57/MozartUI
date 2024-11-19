import { Component, OnInit, ViewChild } from "@angular/core";
import { CalendarEventTimesChangedEvent } from "angular-calendar";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { EventsService } from "../events-new/events.service";
import { MatDialog } from "@angular/material/dialog";
import { CalendarEvent, CalendarView } from "src/app/interface/events.interface";

@Component({
  selector: "app-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
})
export class EventsListComponent implements OnInit {
  view: CalendarView = CalendarView.Day ;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  notes: any;
  dayStartHour: any;
  dayEndHour: any;
  selectedEvent: any = null;
  @ViewChild('eventModal') eventModal: any;
  constructor(private route: Router, private eventsService: EventsService,   private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEvents();
  }


  loadEvents(): void {
    const agentCode = localStorage.getItem("agentCode");
    let getEventReq = [
      {
        agentCode: agentCode,
        customerName: "",
        mobileNumber: "",
        activityTitle: "",
        startDate: "",
        endDate: "",
        activityType: "",
        note: "",
      },
    ];
  
    this.eventsService.getEvents(getEventReq, agentCode).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.events = response.data.map((event: any) => {
            // For each event, process all scheduled times
            return event.eventSchedule.map((schedule: any) => {
              const startDateTime = this.parseDateTime(schedule.date, schedule.startTime);
              const endDateTime = this.parseDateTime(schedule.date, schedule.endTime);
  
        
              console.log("Processing event:", {
                date: schedule.date,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                parsedStart: startDateTime,
                parsedEnd: endDateTime
              });
  
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
    this.selectedEvent = event.event;
    this.openEventModal();
  }

  openEventModal(): void {
    this.dialog.open(this.eventModal, {
      width: '350px',
      position: { top: '50px' },
      disableClose: true,
      data: this.selectedEvent
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
}
