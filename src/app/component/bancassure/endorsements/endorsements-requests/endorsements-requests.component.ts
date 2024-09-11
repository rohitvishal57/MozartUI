import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { endorsementDetails } from 'src/app/interface/endorsementDetails.interface';
import { RenewalList } from 'src/app/interface/renewal-list.interface';
import { AdminService } from 'src/app/services/admin.service';
import { EndorsementsService } from 'src/app/services/endrosements/endorsements.service';
import { RenewalServiceService } from 'src/app/services/renewal/renewal-service.service';

@Component({
  selector: 'app-endorsements-requests',
  templateUrl: './endorsements-requests.component.html',
  styleUrls: ['./endorsements-requests.component.scss']
})
export class EndorsementsRequestsComponent implements OnInit {
  endorsementDetails: endorsementDetails[] = [];
  countsList: any = [];
  activeFilter: string = "All";
  page: number = 1;
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 0;
  selectedView: string = "list";
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  selected: string = "";
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false
  constructor(
    private endorsementService: EndorsementsService,
  ) { }

  ngOnInit(): void {
    this.getRequestList();
  }
  downloadRequest(data: any) {
    alert(data.status);
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
    }
  }

  requestsListRequestBody:any = {
    "agentId": 0,
    "agentCode": "5100003",
    "sessionId": "",
    "userLevel": "",
    "userRole": "",
    "superiorId": 0,
    "designation": "",
    "intCategory": "",
    "category": "Request",
    "eventName": "",
    "branchCode": "",
    "start": 0,
    "length": 0,
    "fromDate": "2024-01-09",
    "toDate": "2024-01-29",
    "sortColumn": "ProductName",
    "searchColumn": "",
    "sortDirection": "DESC",
    "searchString": "",
    "uiStatus": [
      "All"
    ],
    "viewBy": [
      "5300001"
    ]
  }
  getRequestList() {
    this.requestsListRequestBody.agentId = localStorage.getItem('agentCode')
    this.endorsementService.getEndorsementDetailsApi(this.requestsListRequestBody).subscribe(
      (response: any) => {
        if (!response.isSuccess) {
          console.log(response.endorsementDetails);
          this.endorsementDetails = [...response.endorsementDetails];
          this.countsList = response.endorsementDetails;
          this.totalRecords = this.endorsementDetails.length;
        } else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        console.error("Error from API:", error);
      }
    );
  }
  statusFilter(filter: string) {
    this.requestsListRequestBody.uiStatus = [filter];
    this.getRequestList();
    this.activeFilter = filter;
  }
  toggleSearchDropdown() {
    if (this.toggeledropdown == true) {
      this.toggeledropdown = false;
    }
    this.toggeleSearchdropdown = !this.toggeleSearchdropdown;
  }

  onSelectChanges(event: any): void {
    event.stopPropagation(); 
    this.selected !== "none";
    console.log("selected value", this.selected);
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();

    if (this.selected === "memberName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    }
    else if (this.selected === "requestId") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    } else if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    }

    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched();
  }
  getPlaceholder(): string {
    if (this.selected === "requestId") {
      return "Enter Request ID";
    } else if (this.selected === "memberName") {
      return "Enter Member Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    }
    else {
      return "";
    }
  }
  getErrorMessage(): string {
    if (this.searchInputControl.hasError("required")) {
      return "This field is required";
    }
    else if (this.searchInputControl.hasError("pattern")) {
      if (this.selected === "mobileNo") {
        return "Invalid Mobile Number";
      } else if (this.selected === "name") {
        return "Invalid Proposer Name";
      }
    }
    return "";
  }
  cancelSearch() {
    this.toggeleSearchdropdown = false;
    this.selected = "";
    this.requestsListRequestBody.searchColumn = "ProductName";
    this.requestsListRequestBody.sortColumn = "ProductName";
    this.requestsListRequestBody.searchString = "";
    this.getRequestList()
  }
  applySearch() {
    if (this.searchInputControl.valid) {
      if (this.selected === "requestId") {
        this.requestsListRequestBody.sortColumn = "requestId";
        this.requestsListRequestBody.searchColumn = "requestId";
        this.requestsListRequestBody.searchString = this.searchInputControl.value!;
      }
      else if (this.selected === "memberName") {
        this.requestsListRequestBody.sortColumn = "memberName";
        this.requestsListRequestBody.searchColumn = "memberName";
        this.requestsListRequestBody.searchString = this.searchInputControl.value!;
      }
      else if (this.selected === "policyNumber") {
        this.requestsListRequestBody.sortColumn = "policyNumber";
        this.requestsListRequestBody.searchColumn = "policyNumber";
        this.requestsListRequestBody.searchString = this.searchInputControl.value!;
      }
      this.getRequestList();
      this.toggeleSearchdropdown = false;
    }
    else {
      this.toggeleSearchdropdown = true;
    }
  }
  quotesViews(view: string) {
    this.selectedView = view;
  }

}