import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventsService } from './events.service';
import { Router } from '@angular/router';
import { NgToastService } from "ng-angular-popup";

@Component({
  selector: 'app-events-new',
  templateUrl: './events-new.component.html',
  styleUrls: ['./events-new.component.scss']
})
export class EventsNewComponent implements OnInit {
  saveEvent!: FormGroup;
  isSubmitting = false;

  activityTypes = [
    { value: 'Callback', label: 'Callback' },
    { value: 'Demo', label: 'Demo' },
    { value: 'Other', label: 'Other' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Training', label: 'Training' },
    { value: 'Webinar', label: 'Webinar' },
    { value: 'Email', label: 'Email' },
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'In-person', label: 'In-person' },
    { value: 'Survey', label: 'Survey' },
    { value: 'Support', label: 'Support' },
    { value: 'Appointment', label: 'Appointment' },
    { value: 'Task', label: 'Task' },
    { value: 'Project Review', label: 'Project Review' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Consultation', label: 'Consultation' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private eventsService: EventsService, private route: Router, private toast: NgToastService) {}

  ngOnInit(): void {
    this.saveForm();
  }

  saveForm(): void {
    this.saveEvent = this.fb.group({
      agentCode: localStorage.getItem('agentCode'),
      customerName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      activityTitle: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      activityType: ['', Validators.required],
      note: ['']
    });
  }

  // formatTime(time: string): string {
  //   const timeParts = time.split(':');    
  //   let hours = timeParts[0].padStart(2, '0');  
  //   let minutes = timeParts[1].padStart(2, '0');   
  //   let seconds = '00';
  //     return `${hours}:${minutes}:${seconds}`;
  // }
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }

  generateEventSchedule(startDate: string, endDate: string, startTime: string, endTime: string): any[] {
    const schedule = [];
    const currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate <= finalDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      schedule.push({
        date: dateStr,
        startTime: startTime,
        endTime: endTime
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedule;
  }

  onSubmit(): void {
    if (this.saveEvent.valid) {
      this.isSubmitting = true;
      const startTime = this.formatTime(this.saveEvent.value.startTime);
      const endTime = this.formatTime(this.saveEvent.value.endTime);
  
      // const formattedStartTime = this.formatTime(startTime);
      // const formattedEndTime = this.formatTime(endTime);
  
      // this.saveEvent.patchValue({
      //   startTime: formattedStartTime,
      //   endTime: formattedEndTime
      // });

      const eventSchedule = this.generateEventSchedule(
        this.saveEvent.value.startDate,
        this.saveEvent.value.endDate,
        startTime,
        endTime
      );

      const payload = {
        ...this.saveEvent.value,
        startTime,
        endTime,
        eventSchedule  // add the generated schedule here
      };

      this.eventsService.saveEvent(payload).subscribe(
        (response:any) => {
          if (response.isSuccess) {
            this.toast.success({ detail: "Event Created successfully" });
            this.route.navigate(["events/eventsList"]);          
          } else {
            console.error('Failed to save event:', response.message);
          }
          this.isSubmitting = false;
        },
        (error) => {
          console.error('Error saving event:', error);
          this.isSubmitting = false;
        }
      );
    } else {
      this.saveEvent.markAllAsTouched();
    }
  }

  navigateToListEvent() {
    this.route.navigate(["events/eventsList"]);
  }
}