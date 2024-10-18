import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { endorsementDetails } from 'src/app/interface/endorsement.interface';
import { EndorsementsRequestsService } from './endorsements-requests.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

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
  isSearch: boolean = false;
  selected: string = "";
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false
  fromDate: any;
  toDate: any;
  toggeleSearchdropdown: boolean = false;
  toggeledropdown: boolean = false;
  appliedFiltersCount: number = 0;
  StaticRequestTypes = [
   
    {
      name: "Aadhar Card Update",
      value: "aadharNumber",
      selected: false 
    },
    {
      name: "Pancard Update",
      value: "panNumber",
      selected: false
    },
    // {
    //   name: "Change my Primary Registered Number",
    //   value: "primaryContactNumber",
    //   selected: false
    // },
    // {
    //   name: "Change my Alternate number",
    //   value: "alternateContactNumber",
    //   selected: false
    // },
    // {
    //   name: "Change in my Email ID",
    //   value: "email",
    //   selected: false
    // },
    // {
    //   name: "Change my Alternate Email ID",
    //   value: "alternateEmail",
    //   selected: false
    // },
    // {
    //   name: "Change my Primary Registered Number- Member",
    //   value: "memberPrimaryContactNumber",
    //   selected: false
    // },
    // {
    //   name: "Change my Alternate number- member",
    //   value: "memberAlternateContactNumber",
    //   selected: false
    // },
    // {
    //   name: "Change in my Email ID- member",
    //   value: "memberEmail",
    //   selected: false
    // },
    // {
    //   name: "Change my Alternate Email ID - member",
    //   value: "memberAlternateEmail",
    //   selected: false
    // },
    // {
    //   name: "Change of Nominee",
    //   value: "nomineeContact",
    //   selected: false
    // },
    // {
    //   name: "Change in International Contact Number",
    //   value: "internationalContactNumber",
    //   selected: false
    // },  
    // {
    //   name: "Change in International Address",
    //   value: "ChangeinInternationalAddress",
    //   selected: false
    // },

  ];
  agentCode: any;
  productsList: any = [];
  requestTypes:any =[];
  constructor(private router:Router,
    private endorsementService: EndorsementsRequestsService,
    private _router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getRequestList();
    this.getProducts();
  }
  getProducts() {
    this.agentCode =  localStorage.getItem("agentCode");
    const reqData={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res:any) => {
        this.productsList = res.data;
        console.log("product list",this.productsList)
        const uniqueRequestTypes = Array.from(new Set(this.productsList
         .map((product:any) => product.familyPlan)))
         .map((requestType) => ({ name: requestType, selected: false }));
         this.requestTypes = uniqueRequestTypes;
      },
      error: (err:any) => {
         console.log("error coming form getproduct list API");
      }
    })
  }
  downloadRequest(data: any) {
    alert(data.status);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.isSearch = false;
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
      "length": this.rows,
      "sortColumn": "RaisedOn",
      "searchColumn": "",
      "sortDirection": "DESC",
      "searchString": "",
      "uiStatus": ""
  }
   
  getRequestList() {
    if (!this.isSearch) {
      this.requestsListRequestBody.start = (this.page - 1) * this.rows;
      this.requestsListRequestBody.length = this.rows;
    } else {
      this.requestsListRequestBody.start = 0;
    }
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

  getFromDate(event:any){
    this.fromDate = event.target.value;
  }

  getToDate(event:any){
    this.toDate = event.target.value;
  }
  formatDate(dateType: "fromDate" | "toDate") {
    if (dateType === "fromDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "toDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
  }
  toggleFilterDropdown() {
    if(this.toggeleSearchdropdown==true)
    {
       this.toggeleSearchdropdown=false;
    }
    this.toggeledropdown = !this.toggeledropdown;    
  }
  cancel() {
    this.fromDate = null;
    this.toDate = null;
    this.requestsListRequestBody.fromDate = '';
    this.requestsListRequestBody.toDate = '';
    this.toggeledropdown = false;
    this.getRequestList();
  }
  calculateAppliedFiltersCount(){
    const selectedPolicyTypesCount = this.StaticRequestTypes.filter(
      (requestType:any) => requestType.selected).length;
      // const selectedProductsCount = this.productsList.filter(
      //   (product) => product.selected).length;
        let count = selectedPolicyTypesCount;
        if (this.fromDate && this.toDate) {
          count++;
        }
        this.appliedFiltersCount = count;
         this.appliedFiltersCount;
  }
  clear(){
    this.productsList.forEach((product:any) => (product.selected = false));
    this.StaticRequestTypes.forEach((requestType) => (requestType.selected = false));
    this.fromDate = null;
    this.toDate = null;
    this.appliedFiltersCount = 0;
   // this.claimsReqBody.productName = "";
    this.requestsListRequestBody.requestType = "";
    this.requestsListRequestBody.fromDate = "";
    this.requestsListRequestBody.toDate = "";
    this.getRequestList();
  }
  applyFilter() {
    this.calculateAppliedFiltersCount();
  this.formatDate("fromDate");
  this.formatDate("toDate");
  this.requestsListRequestBody.fromDate=this.fromDate;
  this.requestsListRequestBody.toDate=this.toDate;
  const selectedPolicyTypes = this.StaticRequestTypes
  .filter((requestType:any) => requestType.selected)
  .map((requestType:any) => requestType.name);
  // this.requestsListRequestBody.requestType = selectedPolicyTypes.join(", ");
  this.getRequestList();
  this.toggeledropdown=false;
}
  onSelectChanges(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selected = inputElement.value;
    this.searchInputControl.reset();
    this.searchInputControl.clearValidators();
    if (this.selected === "memberName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    }
    else if (this.selected === "caseId") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^\\s*[A-Z0-9-]+\\s*$"),
      ]);
    } else if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^\\s*[0-9-]+\\s*$"),
      ]);
    } else if (this.selected === "date") {
      this.searchInputControl.setValidators([
        Validators.required
      ]);
    }
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched();
  }

  getPlaceholder(): string {
    if (this.selected === "caseId") {
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

  applySearch() {
    const searchValue = this.searchInputControl?.value?.trim();
    if (this.searchInputControl.valid) {
      if (this.selected === "caseId") {
        this.requestsListRequestBody.searchColumn = "CaseId";
        this.requestsListRequestBody.searchString = searchValue;
      }
      else if (this.selected === "memberName") {
        this.requestsListRequestBody.searchColumn = "MemberName";
        this.requestsListRequestBody.searchString = searchValue;
      }
      else if (this.selected === "policyNumber") {
        this.requestsListRequestBody.searchColumn = "PolicyNumber";
        this.requestsListRequestBody.searchString = searchValue;
      }
    this.isSearch = true;
    this.first = 0;
    this.getRequestList();
    }
  }

  quotesViews(view: string) {
    this.selectedView = view;
  }

  redirect(value:any){
    this.router.navigate([value]);
  }
}