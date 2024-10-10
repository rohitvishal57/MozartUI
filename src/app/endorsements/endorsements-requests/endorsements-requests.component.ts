import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { endorsementDetails } from 'src/app/interface/endorsement.interface';
import { EndorsementsRequestsService } from './endorsements-requests.service';

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
  rows: number = 10;
  totalRecords: number = 0;
  selectedView: string = "list";
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  selected: string = "date";
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false
  fromDate: any;
  toDate: any;
  constructor(private router:Router,
    private endorsementService: EndorsementsRequestsService,
    private _router: Router,
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
    this.getRequestList();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
    }
  }

  getEndorsementCaseDetails (data:any) {
    this._router.navigate(['endorsements/endorsemet-details/'+data?.caseId]);
  }

  requestsListRequestBody:any = {
      "agentCode": localStorage.getItem('agentCode'),
      "fromDate": "",
      "toDate": "",
      "start": 0,
      "length": 10,
      "sortColumn": "RequestedOn",
      "searchColumn": "",
      "sortDirection": "DESC",
      "searchString": "",
      "uiStatus": ""
  }
   
  getRequestList() {
    this.requestsListRequestBody.start = (this.page - 1) * this.rows;
    this.requestsListRequestBody.length = this.rows;
    this.endorsementService.getEndorsementDetailsApi(this.requestsListRequestBody).subscribe(
      (response: any) => {
        if (response && response.statusCode == "200" && response.isSuccess) {
          this.endorsementDetails = [...response.endorsementDetails];
          this.countsList = response.endorsementDetails;
          this.totalRecords = response.totalRecords;
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
    if (filter === "All") {
      this.requestsListRequestBody.uiStatus = "";
    } else {
    this.requestsListRequestBody.uiStatus = filter;
    }
    this.getRequestList();
    this.activeFilter = filter;
  }

  toggleSearchDropdown() {
    if (this.toggeledropdown == true) {
      this.toggeledropdown = false;
    }
    this.toggeleSearchdropdown = !this.toggeleSearchdropdown;
  }

  getFromDate(event:any){
    this.fromDate = event.target.value;
  }

  getToDate(event:any){
    this.toDate = event.target.value;
  }

  onSelectChanges(event: any): void {
    event.stopPropagation(); 
    this.selected !== "none";
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();

    if (this.selected === "memberName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    }
    else if (this.selected === "EndorsementID") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    } else if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    } else if (this.selected === "date") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern(
          "^(\\d{4})-(\\d{2})-(\\d{2})$"
        ),
      ]);
    }
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched();
  }

  getPlaceholder(): string {
    if (this.selected === "EndorsementID") {
      return "Enter Request ID";
    } else if (this.selected === "memberName") {
      return "Enter Member Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    }
    else {
      return "Search...";
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
    this.requestsListRequestBody.searchColumn = "";
    this.requestsListRequestBody.sortColumn = "";
    this.requestsListRequestBody.searchString = "";
    this.getRequestList()
  }

  applySearch() {
    if (this.searchInputControl.valid) {
      if (this.selected === "EndorsementID") {
        this.requestsListRequestBody.searchColumn = "EndorsementID";
        this.requestsListRequestBody.searchString = this.searchInputControl.value!;
      }
      else if (this.selected === "memberName") {
        this.requestsListRequestBody.searchColumn = "MemberName";
        this.requestsListRequestBody.searchString = this.searchInputControl.value!;
      }
      else if (this.selected === "policyNumber") {
        this.requestsListRequestBody.searchColumn = "policyNumber";
        this.requestsListRequestBody.searchString = this.searchInputControl.value!;
      } 
      else if (this.selected === "date") {
        this.requestsListRequestBody.fromDate = this.fromDate;
        this.requestsListRequestBody.toDate = this.toDate;
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

  redirect(value:any){
    this.router.navigate([value]);
  }
}