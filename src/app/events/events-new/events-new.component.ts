import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventsService } from './events.service';
import { Router } from '@angular/router';
import { NgToastService } from "ng-angular-popup";
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
interface ReferenceData {
  proposalNum?: string;
  leadNumber?: string;
  name: string;
  phoneNumber: string;
}
interface ApiResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: ReferenceData[];
}
@Component({
  selector: 'app-events-new',
  templateUrl: './events-new.component.html',
  styleUrls: ['./events-new.component.scss']
})
export class EventsNewComponent implements OnInit {
  saveEvent!: FormGroup;
  isSubmitting = false;
  isLoading = false;
  showNameMobile = true;
  filteredReferenceList: ReferenceData[] = [];
  eventNumber: any;
  private referenceSearchSubject = new Subject<string>();

  agentCode = localStorage.getItem('agentCode')
  eventTypes = [
    { value: 'lead', label: 'Leads' },
    { value: 'Proposals', label: 'Proposals' },
    { value: 'others', label: 'Others' }
  ];
  referenceList: ReferenceData[] = [];

  activityTypes = [
    { value: 'Callback', label: 'Callback' },
    { value: 'Demo', label: 'Demo' },
    { value: 'Other', label: 'Other' },
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

  constructor(private fb: FormBuilder, private http: HttpClient, private eventsService: EventsService, private route: Router, private toast: NgToastService, private languageService: LanguageService,
    private translateService: TranslateService) {}

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); 
        }
      });
    });
    this.saveForm();
    this.subscribeToEventTypeChanges();
  }

  saveForm(): void {
    this.saveEvent = this.fb.group({
      agentCode: this.agentCode,
      id:0,
      eventType: ['', Validators.required],
      eventNumber: [''],
      customerName: ['',  [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      activityTitle: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      activityType: ['', Validators.required],
      note: ['',[Validators.required, Validators.pattern('^[A-Za-z0-9\\s.,!?;:()-]*$')]]
    });
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

  onSubmit(): void {
    if (this.saveEvent.valid) {
      this.isSubmitting = true;
      const startTime = this.formatTime(this.saveEvent.value.startTime);
      const endTime = this.formatTime(this.saveEvent.value.endTime);
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
            this.toast.success({
              detail: 'Success',
              summary: "Event Created successfully"
            });
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
  setupReferenceSearch() {
    this.referenceSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterReferenceListInternal(searchTerm);
    });
  }

  filterReferenceList(event: any) {
    const input = (event.target as HTMLInputElement).value.trim();
    
    this.saveEvent.patchValue({
      customerName: '',
      mobileNumber: ''
    });

    this.referenceSearchSubject.next(input);
  }

  filterReferenceListInternal(searchTerm: string) {
    if (!searchTerm) {
      this.filteredReferenceList = this.referenceList;
      return;
    }

    const eventType = this.saveEvent.get('eventType')?.value;
    
    this.filteredReferenceList = this.referenceList.filter(item => {
      this.eventNumber = eventType === 'Proposals' 
        ? item.proposalNum 
        : item.leadNumber;
      
      return this.eventNumber.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  onReferenceNumberSelect(selectedNumber?: string) {
    const eventNumber = selectedNumber || this.saveEvent.get('eventNumber')?.value;    
    const eventType = this.saveEvent.get('eventType')?.value;

    const selectedReference = this.referenceList.find(item => 
      eventType === 'Proposals' 
        ? item.proposalNum === eventNumber
        : item.leadNumber === eventNumber
    );

    if (selectedReference) {
      this.saveEvent.patchValue({
        customerName: selectedReference.name,
        mobileNumber: selectedReference.phoneNumber
      });
    }
  }
  subscribeToEventTypeChanges() {
      this.saveEvent.get('eventType')?.valueChanges.subscribe(type => {
      this.saveEvent.get('eventNumber')?.reset();
      this.saveEvent.get('customerName')?.reset();
      this.saveEvent.get('mobileNumber')?.reset();

      switch(type) {
        case 'Proposals':
          this.showNameMobile = true;
          this.fetchReferenceData('Proposals');
          break;
        case 'lead':
          this.showNameMobile = true;
          this.fetchReferenceData('lead');
          break;
        case 'others':
          this.showNameMobile = false;
          this.referenceList = [];
          break;
      }
    });
  }

  fetchReferenceData(type: string) {
    this.isLoading = true;
    this.referenceList = [];

    const params = {
      agentCode: this.agentCode
    };

    if (type === 'Proposals') {
      this.eventsService.getEventProposals(params).subscribe(
        response => {
          this.handleReferenceDataResponse(response);
        },
        error => {
          this.handleReferenceDataError(error);
        }
      );
    } else if (type === 'lead') {
      this.eventsService.getEventLeads(params).subscribe(
        response => {
          this.handleReferenceDataResponse(response);
        },
        error => {
          this.handleReferenceDataError(error);
        }
      );
    }
  }

  private handleReferenceDataResponse(response: ApiResponse) {
    this.isLoading = false;
    if (response.isSuccess && response.data) {
      this.referenceList = response.data;
      this.filteredReferenceList = [...this.referenceList];
    } else {
      console.error('Error fetching data', response.message);
    }
  }

  private handleReferenceDataError(error: any) {
    this.isLoading = false;
    console.error('Error fetching data', error);
  }
  
 

  navigateToListEvent() {
    this.route.navigate(["events/eventsList"]);
  }
}