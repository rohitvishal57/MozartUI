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
    { value: 'others', label: 'others' }
  ];
  activityTypes = [
    { value: 'Callback', label: 'Callback' },
    { value: 'Demo', label: 'Demo' },
    { value: 'other', label: 'other' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Birthday', label: 'Birthday' },
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {
    this.initializeForm();
      // Get ID from either route params or query params
  this.route.params.subscribe(params => {
    if (params['id']) {
      this.eventId = params['id'];
    }
  });

  this.route.queryParams.subscribe(params => {
    if (params['id']) {
      this.eventId = params['id'];
    }
    // Rest of your queryParams handling...
  });

  }
  initializeForm() {
    this.eventForm = this.fb.group({
      id: [],
      eventType: ['', Validators.required],
      eventNumber: [''],
      customerName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      leadNumber: [''],
      other: [''],
      proposalNumber: [''],
      activityTitle: ['', Validators.required],
      activityType: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      endDate: ['', Validators.required],
      note: [''],
      agentCode: ['']
    });
  
    // Subscribe to queryParams to patch the form
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
      const eventType = params['eventType'];
      const customerName = params['customerName'];
      const eventNumber = params['eventNumber'];
      const mobileNumber = params['mobileNumber'];
      const activityTitle = params['activityTitle'];
      const activityType = params['activityType'];
      const startDate = params['startDate'];
      const endDate = params['endDate'];
      const startTime = params['startTime'];
      const endTime = params['endTime'];
      const note = params['note'];
  
      // Patch form values from queryParams
      this.eventForm.patchValue({
        eventType: eventType,
        eventNumber: (eventType === 'Leads' || eventType === 'proposal') ? eventNumber : '',
        customerName: customerName,
        mobileNumber: mobileNumber,
        activityTitle: activityTitle,
        activityType: activityType,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        note: note
      });
  
      console.log('Form after patch:', this.eventForm.value);
      console.log('Start Date:', startDate);
      
      // Dynamically apply validation based on eventType
      this.setEventNumberValidators(eventType);
  });

  // Listen for changes in eventType and apply validators dynamically
  this.eventForm.get('eventType')?.valueChanges.subscribe(eventType => {
    this.setEventNumberValidators(eventType);
  });
}

// Method to set validators for eventNumber based on eventType
setEventNumberValidators(eventType: string) {
  const eventNumberControl = this.eventForm.get('eventNumber');

  if (eventType === 'Leads' || eventType === 'proposal') {
    eventNumberControl?.setValidators(Validators.required);
  } else {
    eventNumberControl?.clearValidators();  // Optionally clear validator if not needed
  }

  eventNumberControl?.updateValueAndValidity();
}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loadEventDetails();
    });
  }

  // loadEventDetails() {
  //   const reqBody = {
  //     id: this.eventId
  //   };

  //   this.eventsService.eventListById(reqBody).subscribe({
  //     next: (response: any) => {
  //       if (response.isSuccess && response.data) {
  //         let eventType = 'other';
  //         let eventNumber = '';
          
  //         if (response.data. eventType = 'Leads') {
  //           eventNumber = response.data.leadNumber;
  //         } else if (response.data.proposalNumber) {
  //           eventType = 'proposal';
  //           eventNumber = response.data.proposalNumber;
  //         }
  //         const startDate = this.formatDate(response.data.startDate);
  //         const endDate = this.formatDate(response.data.endDate);
          
  //         // Format times to remove seconds
  //         const startTime = response.data.startTime.substring(0, 5);
  //         const endTime = response.data.endTime.substring(0, 5);

  //         this.eventForm.patchValue({
  //           eventType: eventType,
  //           customerName: response.data.customerName,
  //           mobileNumber: response.data.mobileNumber,
  //           activityTitle: response.data.activityTitle,
  //           activityType: response.data.activityType,
  //           startDate: startDate,
  //           startTime: startTime,
  //           endTime: endTime,
  //           endDate: endDate,
  //           note: response.data.note,
  //           agentCode: response.data.agentCode
  //         });
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading event details', error);
  //       // Add error notification here
  //     }
  //   });
  // }
  loadEventDetails() {
    const reqBody = {
      id: this.eventId
    };
  
    this.eventsService.eventListById(reqBody).subscribe({
      next: (response: any) => {
        if (response.isSuccess && response.data) {
          let eventType = 'others';  // Changed default to match your eventTypes array
          let eventNumber = '';
          
          // Fix the comparison operator
          if (response.data.eventType === 'Leads') {  // Changed = to ===
            eventNumber = response.data.leadNumber;
            eventType = 'Leads';
          } else if (response.data.proposalNumber) {
            eventType = 'proposal';
            eventNumber = response.data.proposalNumber;
          }
          
          const startDate = this.formatDate(response.data.startDate);
          const endDate = this.formatDate(response.data.endDate);
          const startTime = response.data.startTime.substring(0, 5);
          const endTime = response.data.endTime.substring(0, 5);
  
          this.eventForm.patchValue({
            id: this.eventId,
            eventType: eventType,
            eventNumber: eventNumber,
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
  
          // Trigger validation update
          this.eventForm.updateValueAndValidity();
        }
      },
      error: (error) => {
        console.error('Error loading event details', error);
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

  onSubmit() {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      const startTime = this.formatTime(this.eventForm.value.startTime);
      const endTime = this.formatTime(this.eventForm.value.endTime);
      const eventSchedule = this.generateEventSchedule(
        this.eventForm.value.startDate,
        this.eventForm.value.endDate,
        startTime,
        endTime
      );

      const payload = {
        ...this.eventForm.value,
        startTime,
        endTime,
        eventSchedule  // add the generated schedule here
      };
      const formData = this.eventForm.value;
      const updateData = {
        id: this.eventId, // This will now have the correct ID from the route params
        agentCode: formData.agentCode || '',
        eventType: formData.evenType,
        customerName: formData.customerName,
        mobileNumber: formData.mobileNumber,
        leadNumber: formData.leadNumber,
        proposalNumber: formData.proposalNumber,
        activityTitle: formData.activityTitle,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        activityType: formData.activityType,
        note: formData.note
      };
  
      // Handle event number based on event type
      if (formData.eventType === 'Leads') {
        updateData['leadNumber'] = formData.eventNumber;
      } else if (formData.eventType === 'proposal') {
        updateData['proposalNumber'] = formData.eventNumber;
      }
  
      this.eventsService.saveEvent(payload).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            // Handle success - maybe navigate back to list
            this.navigateToListEvent();
          }
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('Error updating event', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}