import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventsService } from './events.service';

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
    { value: 'Other', label: 'Other' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private eventsService: EventsService) {}

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

  onSubmit(): void {
    if (this.saveEvent.valid) {
      this.isSubmitting = true;
      this.eventsService.saveEvent(this.saveEvent.value).subscribe(
        (response:any) => {
          if (response.isSuccess) {
            console.log('Event saved successfully:', response.data);
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
}