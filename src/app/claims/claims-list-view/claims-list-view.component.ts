import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ClaimsInterface } from 'src/app/interface/claims.interface';
import { ClaimsViewService } from '../claims-view/claims-view.service';
import { searchValidationConfig } from 'src/app/interface/common-validation.interface';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { ExcelExportService } from 'src/app/services/excel-export.service';


@Component({
  selector: 'app-claims-list-view',
  templateUrl: './claims-list-view.component.html',
  styleUrls: ['./claims-list-view.component.scss'],
})
export class ClaimsListViewComponent implements OnInit {
  displayedColumns: string[] = ['request', 'policyNo', 'productName', 'memberName', 'memberRelation', 'requestType', 'status', 'raisedDate', 'download'];
  allData: ClaimsInterface[] = [];
  claims: any[] = [];
  selectedListView: string = '';
  selectedView: string = 'list';
  viewClaims: boolean = false;
  gridClaims: any[] = [];
  gridClaimsData: any[] = [];
  first: number = 0;
  totalRecords: number = 0;
  rows: number = 10;
  page: number = 1;
  activeFilter: any
  selectedStatus: string = "all";
  startDate: any;
  endDate: any;
  filterType: string = 'totalRecords';
  claimStatusCounts: any = {
    all: 0,
    active: 0,
    approved: 0,
    settled: 0,
    rejected: 0,
    UnderDeficiency: 0
  };
  toggleSearchdropdown: boolean = false;
  searchInputControl = new FormControl("");
  selected: string = "";
  userId!: number;
  selectedClaim: any = null;
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  fromDate: any;
  toDate: any;
  appliedFiltersCount: number = 0;
  requestTypes: any[] = [];
  maxDate: string | undefined;
  isSearch: boolean = false;
  productsList: any;
  countsList: any = [];
  status: string = "totalRecords";
  isDesktopView: boolean = false;
  agentCode = localStorage.getItem('agentCode')
  designationName: string | any;
  StaticRequestTypes = [
    { name: 'Cashless', selected: false },
    { name: 'Reimbursement', selected: false },
  ];

  constructor(private http: HttpClient, 
     private router: Router,
     private commonService: CommonService, 
     private datePipe: DatePipe, 
     private claimsService: ClaimsViewService, 
     private languageService: LanguageService, 
     private excelExportService: ExcelExportService,
     private translateService: TranslateService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.designationName = localStorage.getItem('designation')
    if(this.designationName === 'DIRECT'){
      this.designationName = 'Agent'
    }
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });

    this.fetchData();
    //this.fetchClaimStatusCounts(this.agentCode);
    this.checkView();
  }

  claimsView(view: string) {
    this.selectedView = view;
  }

  //-------navigate to My-claims-view ----------
  navigateToCreateClaim() {
    this.viewClaims = true;
    this.router.navigate(['claims/createClaims']);
  }

  //-------------filters--------------//
  filterClaims(filter: string, filterRange: string) {
    this.claimsReqBody.filterType = filter;
    this.page = 1;
    this.fetchData();
    this.selectedStatus = filter;
    this.filterType = filterRange;
  }

  //---------pagination------------//
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1
    this.isSearch = false;
    this.fetchData();
  }

  // getFromDate(event: any) {
  //   this.fromDate = event.target.value;
  // }

  // getToDate(event: any) {
  //   this.toDate = event.target.value;
  // }

  //---------API Call-------//
  claimsReqBody = {
    "productVarientName": "",
    "agentCode": this.agentCode,
    "requestId": "",
    "policyNumber": "",
    "requestType": "",
    "startDate": null,
    "endDate": null,
    "pageNumber": 1,
    "pageSize": 10,
    "mobileNumber": "",
    "filterType": "",
    "memberId": ""
  }

  fetchData(): void {
    if (!this.isSearch) {
      this.claimsReqBody.pageNumber = this.page;
      this.claimsReqBody.pageSize = this.rows;
    } else {
      this.claimsReqBody.pageNumber = 1;
    }
    this.claimsService.getClaimsList(this.claimsReqBody).subscribe((res: any) => {
      if (res.data && res.statusCode == "200" && res.isSuccess) {
        this.claims = res.data.claimDetails;
        // this.productsList = res.claimDetails     
        this.gridClaimsData = res.data.claimDetails;
        this.countsList = res.data;
        this.totalRecords = res.data[this.filterType];
      }
      else {
        console.error("API request was not successful.");
      }
    });

  }

  toggleFilterDropdown() {
    if (this.toggeleSearchdropdown == true) {
      this.toggeleSearchdropdown = false;
    }
    this.toggeledropdown = !this.toggeledropdown;
    this.maxDate = new Date().toISOString().split('T')[0];
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
        console.error(err, "error coming form getproduct list API");
      }
    })
  }


  calculateAppliedFiltersCount() {
    const selectedProductsCount = this.productsList.filter(
      (product: any) => product.selected).length;
    const selectedPolicyTypesCount = this.StaticRequestTypes.filter(
      (policyType: any) => policyType.selected).length;
    let count = selectedProductsCount + selectedPolicyTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count;
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

  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate('startDate');
    this.formatDate('endDate');
    
    this.claimsReqBody.startDate = this.fromDate; 
    this.claimsReqBody.endDate = this.toDate; 
    
    console.log("start date taken by request body", this.claimsReqBody.startDate);
    console.log("end date taken by request body", this.claimsReqBody.endDate);
      const selectedProducts = this.productsList
      .filter((product: any) => product.selected)
      .map((product: any) => product.productName);
    console.log("selectedProducts", selectedProducts);
    this.claimsReqBody.productVarientName = selectedProducts.join(", ");
    console.log("product names which are taking by request body", this.claimsReqBody.productVarientName);
  
    const selectedPolicyTypes = this.StaticRequestTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
    console.log("selected policy types", selectedPolicyTypes);
    this.claimsReqBody.requestType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body", this.claimsReqBody.requestType);
    this.first = 0;
    this.page = 1;
    this.fetchData();
    this.toggeledropdown = false;
  }
  
  cancel() {
    this.toggeledropdown = false;
  }
  clear() {
    this.productsList.forEach((product: any) => (product.selected = false));
    this.StaticRequestTypes.forEach((requestType) => (requestType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.claimsReqBody.productVarientName = "";
    this.claimsReqBody.requestType = "";
    this.claimsReqBody.startDate = null;
    this.claimsReqBody.endDate = null;
    this.fetchData();
  }
  onSelectChanges(event: any): void {
    if (this.selected === "") {
      this.claimsReqBody.filterType = "";
      this.claimsReqBody.policyNumber = "";
      this.claimsReqBody.memberId = "";
      this.claimsReqBody.requestId = "";
      this.claimsReqBody.mobileNumber = ""
      // this.claimsReqBody.searchString = []
      this.fetchData();
    }
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
  }

  getPlaceholder(): string {
    if (this.selected === 'policyNumber') {
      return 'Enter Policy Number';
    } else if (this.selected === 'requestId') {
      return 'Enter Claim No.';
    } else if (this.selected === 'memberId') {
      return 'Enter Member ID';
    } else if (this.selected === 'mobileNumber') {
      return 'Enter Mobile Number';
    }
    else {
      return 'Search...';
    }
  }
  resetFilters(): void {
    this.claimsReqBody.filterType = '';
    //this.claimsReqBody.searchString = [];
    this.isSearch = false;
    this.first = 0;
    this.fetchData();
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    if (value === '') {
      this.applySearch();
    }
  }

  downloadSingleItem(item: any): void {
    this.excelExportService.exportToExcel([item], `Claims_${item.caseId}`);
  }

  downloadAll(): void {
    this.excelExportService.exportToExcel(
      this.claims,
      'My_Claims'
    );
  }

  applySearch() {

    let searchValue = this.searchInputControl.value?.trim();
    if (!searchValue) {
      this.claimsReqBody.memberId = "";
      this.claimsReqBody.requestId = "";
      this.claimsReqBody.mobileNumber = "";
      this.claimsReqBody.policyNumber = "";
      this.isSearch = false;
      // this.first = 0
      this.fetchData();
    }
    if (searchValue && this.searchInputControl.valid) {
      if (this.selected === "policyNumber") {
        this.claimsReqBody.policyNumber = searchValue;
        this.claimsReqBody.memberId = "";
        this.claimsReqBody.requestId = "";
        this.claimsReqBody.mobileNumber = ""
      } else if (this.selected === "memberId") {
        this.claimsReqBody.memberId = searchValue;
        this.claimsReqBody.mobileNumber = "";
        this.claimsReqBody.requestId = "";
        this.claimsReqBody.policyNumber = ""
      } else if (this.selected === "requestId") {
        this.claimsReqBody.requestId = searchValue;
        this.claimsReqBody.mobileNumber = "";
        this.claimsReqBody.memberId = "";
        this.claimsReqBody.policyNumber = ""
      } else if (this.selected === "mobileNumber") {
        this.claimsReqBody.mobileNumber = searchValue;
        this.claimsReqBody.memberId = "";
        this.claimsReqBody.requestId = "";
        this.claimsReqBody.policyNumber = ""
      }
      this.first = 0;
      this.page = 1;
      this.fetchData();
    }
  }

  navigateToViewClaim(row: any) {
    let claimDetailsReqBody = {
      "id": row.id,
      "claimNumber": row.claimNumber,
      "policyNumber": row.policyNumber
    };
    this.claimsService.getClaimDetailsView(claimDetailsReqBody).subscribe(
      (response) => {
        this.router.navigate([`/claims/detailsView/${row.id}/${row.claimNumber}/${row.policyNumber}`]);
      },
      (error) => {
        console.error('Error fetching claim details', error);

      }
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkView();
  }
  //Screen View check
  checkView() {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      this.selectedView = 'grid';
    } else {
      this.selectedView = 'list';
    }
  }
}