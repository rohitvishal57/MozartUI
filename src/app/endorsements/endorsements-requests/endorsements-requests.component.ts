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

  tableData = {
    title: 'All requests',
    actionbtnList: [
      {
        name: 'New Requests', class: 'btn_newRequest', icon: 'assets/Img/icon_plus_red.svg'
      }
    ],
    filterList : [
      {
        name : 'All' , description : 'All', class : 'All', icon : ''
      },
      {
        name : 'Active' , description : 'All', class : 'Active', icon : ''
      },
      {
        name : 'Resolved' , description : 'All', class : 'Resolved', icon : ''
      },
      {
        name : 'Cancelled' , description : 'All', class : 'Cancelled', icon : ''
      }
    ]
  };

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
  maxDate: string | undefined
  /* StaticRequestTypes = [
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
    {
      name: "Change my Primary Registered Number",
      value: "primaryContactNumber",
      selected: false
    },
    {
      name: "Change my Alternate number",
      value: "alternateContactNumber",
      selected: false
    },
    {
      name: "Change in my Email ID",
      value: "email",
      selected: false
    },
    {
      name: "Change my Alternate Email ID",
      value: "alternateEmail",
      selected: false
    },
    {
      name: "Change my Primary Registered Number- Member",
      value: "memberPrimaryContactNumber",
      selected: false
    },
    {
      name: "Change my Alternate number- member",
      value: "memberAlternateContactNumber",
      selected: false
    },
    {
      name: "Change in my Email ID- member",
      value: "memberEmail",
      selected: false
    },
    {
      name: "Change my Alternate Email ID - member",
      value: "memberAlternateEmail",
      selected: false
    },
    {
      name: "Change of Nominee",
      value: "nomineeContact",
      selected: false
    },
    {
      name: "Change in International Contact Number",
      value: "internationalContactNumber",
      selected: false
    },  
    {
      name: "Change in International Address",
      value: "ChangeinInternationalAddress",
      selected: false
    },
  ]; */
  agentCode: any;
  productsList: any = [];
  requestTypes: any = [];
  constructor(private router: Router,
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
    this.agentCode = localStorage.getItem("agentCode");
    const reqData = {
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res: any) => {
        this.productsList = res.data;
        const uniqueRequestTypes = Array.from(new Set(this.productsList
          .map((product: any) => product.familyPlan)))
          .map((requestType) => ({ name: requestType, selected: false }));
        this.requestTypes = uniqueRequestTypes;
      },
      error: (err: any) => {
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

  getEndorsementCaseDetails(data: any) {
    this._router.navigate(['endorsements/endorsemet-details/' + data?.caseId]);
  }

  requestsListRequestBody: any = {
    "agentCode": localStorage.getItem('agentCode'),
    "fromDate": "",
    "toDate": "",
    "start": 0,
    "length": this.rows,
    "sortColumn": "RaisedOn",
    "searchColumn": "",
    "sortDirection": "DESC",
    "searchString": [],
    "uiStatus": ""
  }

  getRequestList() {
    if (!this.isSearch) {
      this.requestsListRequestBody.start = (this.page - 1) * this.rows;
      this.requestsListRequestBody.length = this.rows;
    } else {
      this.requestsListRequestBody.start = 0;
    }
    this.endorsementDetails = [];
    this.endorsementService.getEndorsementDetailsApi(this.requestsListRequestBody).subscribe(
      (response: any) => {
        if (response.data && response.statusCode == "200" && response.isSuccess) {
          this.endorsementDetails = response.data.endorsementDetails.map((obj: any) => {
            const date = new Date(obj.raisedOn);
            const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
            return {
              ...obj, raisedOn: formattedDate
            }
          });
          this.countsList = response.data.endorsementDetails;
          this.totalRecords = response.data.totalRecords;
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

  formatDate(dateType: "fromDate" | "toDate") {
    if (dateType === "fromDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "toDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
  }

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
  calculateAppliedFiltersCount() {
    // const selectedPolicyTypesCount = this.StaticRequestTypes.filter((requestType:any) => requestType.selected).length;
    const selectedProductsCount = this.productsList.filter((product: any) => product.selected).length;
    let count = selectedProductsCount;
    if (this.fromDate && this.toDate) {
      count++;
    }
    this.appliedFiltersCount = count;
  }
  clear() {
    this.productsList.forEach((product: any) => (product.selected = false));
    // this.StaticRequestTypes.forEach((requestType) => (requestType.selected = false));
    this.fromDate = null;
    this.toDate = null;
    this.appliedFiltersCount = 0;
    this.requestsListRequestBody.searchString = [];
    this.requestsListRequestBody.fromDate = "";
    this.requestsListRequestBody.toDate = "";
    this.toggeledropdown = false;
    this.getRequestList();
  }
  applyFilter() {
    this.selected = "";
    this.searchInputControl.reset();
    this.calculateAppliedFiltersCount();
    this.formatDate("fromDate");
    this.formatDate("toDate");
    this.requestsListRequestBody.fromDate = this.fromDate;
    this.requestsListRequestBody.toDate = this.toDate;
    const selectedProducts = this.productsList.filter((product: any) => product.selected)
      .map((product: any) => product.productName);
    if (selectedProducts.length > 0) {
      this.requestsListRequestBody.searchColumn = "ProductName"
      this.requestsListRequestBody.searchString = selectedProducts;
    }

    /* const selectedPolicyTypes = this.StaticRequestTypes
    .filter((requestType:any) => requestType.selected)
    .map((requestType:any) => requestType.name);
    this.requestsListRequestBody.requestType = selectedPolicyTypes.join(", "); */

    this.isSearch = true;
    this.first = 0;
    this.getRequestList();
    this.toggeledropdown = false;
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
    } else if (this.selected === "") {
      this.requestsListRequestBody.searchColumn = "";
      this.requestsListRequestBody.searchString = [];
      this.getRequestList();
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
    this.endorsementDetails = [];
    if (this.searchInputControl.valid) {
      if (this.selected === "caseId") {
        this.requestsListRequestBody.searchColumn = "CaseId";
        this.requestsListRequestBody.searchString = [searchValue];
      }
      else if (this.selected === "memberName") {
        this.requestsListRequestBody.searchColumn = "MemberName";
        this.requestsListRequestBody.searchString = [searchValue];
      }
      else if (this.selected === "policyNumber") {
        this.requestsListRequestBody.searchColumn = "PolicyNumber";
        this.requestsListRequestBody.searchString = [searchValue];
      }
      this.isSearch = true;
      this.first = 0;
      this.getRequestList();
    }
  }

  quotesViews(view: string) {
    this.selectedView = view;
  }

  redirect(value: any) {
    this.router.navigate([value]);
  }

  onEmitBtn(ev : any){}
}