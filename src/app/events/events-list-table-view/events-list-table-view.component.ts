import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events-new/events.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { searchValidationConfig } from 'src/app/interface/common-validation.interface';
import { NgToastService } from "ng-angular-popup";

@Component({
  selector: 'app-events-list-table-view',
  templateUrl: './events-list-table-view.component.html',
  styleUrls: ['./events-list-table-view.component.scss']
})

export class EventsListTableViewComponent implements OnInit {
  constructor(private http: HttpClient, private eventsService: EventsService, private datePipe : DatePipe, private route: Router, private toast: NgToastService) {}
  ngOnInit(): void {
   this.loadEvents();
  }
  
  selected: string = "";
  events:any;
  agentCode = localStorage.getItem("agentCode");
  searchInputControl = new FormControl("");
  fromDate: any;
  toDate: any;
  first: number = 0;
  totalRecords: number = 0;
  rows: number = 10;
  page: number = 1;
  isSearch:boolean = false;
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  maxDate: string | undefined;
  appliedFiltersCount: number = 0;
  startDate: any;
  endDate: any;
  staticEventTypes = [
    { name: 'Leads', selected: false },
    { name: 'Proposals', selected: false },
    { name: 'Others', selected: false },

  ];


  toggleFilterDropdown() {
    if (this.toggeleSearchdropdown == true) {
      this.toggeleSearchdropdown = false;
    }
    this.toggeledropdown = !this.toggeledropdown;
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  cancel() {
    this.toggeledropdown = false;
  }
  clear() {
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.getEventReq.startDate = null;
    this.getEventReq.endDate = null;
    this.loadEvents();
  }
  calculateAppliedFiltersCount() {
    const selectedEventTypesCount = this.staticEventTypes.filter(
      (eventType: any) => eventType.selected).length;
    let count = selectedEventTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count;
  }
  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate('startDate');
    this.formatDate('endDate');
    
    this.getEventReq.startDate = this.fromDate; 
    this.getEventReq.endDate = this.toDate; 
    
    const selectedEventTypes = this.staticEventTypes
    .filter((eventType) => eventType.selected)
    .map((eventType) => eventType.name);
  console.log("selected event types", selectedEventTypes);
  this.getEventReq.eventType = selectedEventTypes.join(",");
    console.log("start date taken by request body", this.getEventReq.startDate);
    console.log("end date taken by request body", this.getEventReq.endDate);
    this.first = 0;
    this.page = 1;
    this.loadEvents();
    this.toggeledropdown = false;
  }

  getEventReq = 
  {
    "agentCode": this.agentCode,
    "startDate": null,
    "endDate": null,
    "eventType": "",
    "eventNumber": "",
    "customerName": "",
    "mobileNumber": "",
    "pageNumber": 1,
    "pageSize": 10
  }

  loadEvents(): void { 
    if (!this.isSearch) {
      this.getEventReq.pageNumber = this.page;
      this.getEventReq.pageSize = this.rows;
    } else {
      this.getEventReq.pageNumber = 1;
    }
    this.eventsService.getEvents(this.getEventReq, this.agentCode).subscribe(
      (response: any) => {
        if (response?.isSuccess) {
          this.events = response?.data?.eventList
          this.totalRecords = response?.data?.totalRecords
          // this.totalRecords = this.events;
          
          // this.events = response.data.map((event: any) => {
          //   return event.eventSchedule.map((schedule: any) => {
              // const startDateTime = this.parseDateTime(schedule.date, schedule.startTime);
              // const endDateTime = this.parseDateTime(schedule.date, schedule.endTime);
  
              // if (!startDateTime || !endDateTime) {
              //   console.error("Invalid date/time for event:", event);
              //   return null;
              // }
          //   });
          // })
        } else {
          console.error("Error loading events:", response.message);
        }
      },
      (error: any) => {
        console.error("Error loading events:", error);
      }
    );
  }
  onSelectChanges(event: any): void {
    if (this.selected === "") {
      this.getEventReq.eventNumber = "";
     // this.getEventReq.proposalNumber = "";
      this.loadEvents();
    }
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
  }

  getPlaceholder(): string {
    if (this.selected === 'eventNumber') {
      return 'Enter Lead/Proposal No.';
    } else if(this.selected === 'mobileNumber'){
      return 'Enter Mobile Number'
    } else if(this.selected === 'customerName'){
      return 'Enter Customer Name'
    }
    else {
      return 'Search...';
    }
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    if (value === '') {
      this.applySearch();
    }
  }

  applySearch() {
    let searchValue = this.searchInputControl.value?.trim();
    if (!searchValue) {
      this.getEventReq.eventNumber = "";
      this.getEventReq.mobileNumber = "";
      this.getEventReq.customerName = "";

     // this.getEventReq.proposalNumber = "";
     // this.isSearch = false;
      this.loadEvents();
    }
    if (searchValue && this.searchInputControl.valid) {
    if(this.selected === 'eventNumber'){
        this.getEventReq.eventNumber = searchValue;
        this.getEventReq.mobileNumber = "";
        this.getEventReq.customerName = "";
    }
    else if(this.selected === 'mobileNumber'){
      this.getEventReq.mobileNumber = searchValue;
      this.getEventReq.eventNumber = "";
      this.getEventReq.customerName = "";
    }
    else if(this.selected === 'customerName'){
      this.getEventReq.customerName = searchValue;
      this.getEventReq.eventNumber = "";
      this.getEventReq.mobileNumber = "";
    }
        //this.getEventReq.proposalNumber = ""
    
      // this.first = 0;
      // this.page = 1;
      this.loadEvents();
    }
  }

  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
    // Ensure endDate is not earlier than startDate
    if (this.toDate && this.fromDate && this.toDate < this.fromDate) {
      this.toDate = null; 
    }
  }

  deleteRow(row: any) {
    let deleteEventReq = {
      id: row.id
    };
    
    this.eventsService.deleteEvent(deleteEventReq).subscribe({
      next: (response:any) => {
        if (response.isSuccess) {  
          const index = this.events.findIndex((item:any) => item.id === row.id);
          if (index) {
            this.events.splice(index, 1);
          }
          this.toast.success({ detail: "Row Deleted successfully" });
        } else {
          this.toast.error({ detail: "Error occurred while deleting" });
        }
      }
    });
  }
  //---------pagination------------//
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1
    this.isSearch = false;
    this.loadEvents();
  }
  
  navigateToEvents() {
    this.route.navigate(["events/eventsList"]);
  }
  // navigateToEditEvent(row:any){
  //   let claimDetailsReqBody = {
  //     "id": row.id,
    
  //   };
  //   this.eventsService.eventListById(claimDetailsReqBody).subscribe(
  //     (response:any) => {
  //       this.route.navigate([`/events/editEvents/${row.id}`]);
  //     },
  //     (error:any) => {
  //       console.error('Error fetching claim details', error);

  //     }
  //   );
  // }
  navigateToEditEvent(row: any) {
    let claimDetailsReqBody = {
      id: row.id,
    };
    console.log('row',row);
    // const rowStartDate = this.datePipe.transform(new Date(row.startDate), 'MM-dd-yyyy');
    // const rowEndDate = this.datePipe.transform(new Date(row.endDate), 'MM-dd-yyyy');
    // console.log(rowStartDate, rowEndDate);
    const formatDate = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toISOString().split('T')[0]; // Extracts only the date portion
    };
    
    this.eventsService.eventListById(claimDetailsReqBody).subscribe(
      (response: any) => {
        const queryParams = {
          id: row.id,
          eventType: row.eventType,
          eventNumber: row.eventNumber,
          customerName: row.customerName,
          mobileNumber: row.mobileNumber,
          activityTitle: row.activityTitle,
          activityType: row.activityType,
          startDate: formatDate(row.startDate),
          endDate: formatDate(row.endDate),
          startTime: row.eventSchedule[0].startTime,
          endTime: row.eventSchedule[0].endTime,
          note: row.note
        };
        console.log('query', queryParams);
        
        this.route.navigate([`/events/editEvents/${row.id}`], { queryParams });
            },
      (error: any) => {
        console.error('Error fetching claim details', error);
      }
    );
  }
}
