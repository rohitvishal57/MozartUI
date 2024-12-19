import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../events-new/events.service';

@Component({
  selector: 'app-events-edit-view',
  templateUrl: './events-edit-view.component.html',
  styleUrls: ['./events-edit-view.component.scss']
})

export class EventsEditViewComponent implements OnInit {
  eventForm!: FormGroup;
  eventId!: string;
  isSubmitting: boolean = false;
  
  eventTypes = [
    { value: 'Leads', label: 'Lead Number' },
    { value: 'proposal', label: 'Proposal Number' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      eventType: ['', Validators.required],
      customerName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      activityTitle: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      activityType: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      endDate: ['', Validators.required],
      note: ['', [Validators.pattern('^[A-Za-z0-9\\s.,!?;:()-]*$')]],
      agentCode: ['']
    });
    this.eventForm.get('eventType')?.valueChanges.subscribe(type => {
      const eventNumberControl = this.eventForm.get('eventNumber');
      if (type === 'Leads' || type === 'proposal') {
        eventNumberControl?.setValidators([Validators.required]);
      } else {
        eventNumberControl?.clearValidators();
      }
      eventNumberControl?.updateValueAndValidity();
    });

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loadEventDetails();
    });
  }

  loadEventDetails() {
    const reqBody = {
      id: this.eventId
    };

    this.eventsService.eventListById(reqBody).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          let eventType = 'other';
          let eventNumber = '';
          
          if (response.data.leadNumber) {
            eventType = 'Leads';
            eventNumber = response.data.leadNumber;
          } else if (response.data.proposalNumber) {
            eventType = 'proposal';
            eventNumber = response.data.proposalNumber;
          }

          const startDate = this.formatDate(response.data.startDate);
          const endDate = this.formatDate(response.data.endDate);
          
          // Format times to remove seconds
          const startTime = response.data.startTime.substring(0, 5);
          const endTime = response.data.endTime.substring(0, 5);

          this.eventForm.patchValue({
            eventType: eventType,
            customerName: response.data.customerName,
            mobileNumber: response.data.mobileNumber,
            activityTitle: response.data.activityTitle,
            activityType: response.data.activityType,
            startDate: startDate,
            startTime: startTime,
            endTime: endTime,
            endDate: endDate,
            note: response.data.note,
            agentCode: response.data.agentCode
          });
        }
      },
      error: (error) => {
        console.error('Error loading event details', error);
        // Add error notification here
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // toggleEdit() {
  //   this.isEditing = !this.isEditing;
  //   if (this.isEditing) {
  //     this.enableForm();
  //   } else {
  //     this.disableForm();
  //   }
  // }

  // enableForm() {
  //   Object.keys(this.eventForm.controls).forEach(key => {
  //     this.eventForm.get(key)?.enable();
  //   });
  // }

  // disableForm() {
  //   Object.keys(this.eventForm.controls).forEach(key => {
  //     this.eventForm.get(key)?.disable();
  //   });
  // }

  navigateToListEvent() {
    this.router.navigate(['/events/eventsListView']);
  }

  onSubmit() {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = this.eventForm.value;
      const updateData = {
        id: this.eventId,
        agentCode: formData.agentCode,
        customerName: formData.customerName,
        mobileNumber: formData.mobileNumber,
        leadNumber: formData.Leads,
        proposalNumber: formData.proposalNumber,
        activityTitle: formData.activityTitle,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        activityType: formData.activityType,
        note: formData.note
      };

      if (formData.eventType === 'lead') {
        updateData.leadNumber = formData.eventNumber;
      } else if (formData.eventType === 'proposal') {
        updateData.proposalNumber = formData.eventNumber;
      }

      this.eventsService.eventListById(updateData).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
          }
          this.isSubmitting = false;
        },
        error: (error:any) => {
          console.error('Error updating event', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}