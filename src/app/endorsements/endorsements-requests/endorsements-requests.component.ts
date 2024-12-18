import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { endorsementDetails } from 'src/app/interface/endorsement.interface';
import { EndorsementsRequestsService } from './endorsements-requests.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { searchValidationConfig }  from 'src/app/interface/common-validation.interface';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { ExcelExportService } from 'src/app/services/excel-export.service';
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
  activeCount: number = 0;
  resolvedCount: number = 0;
  cancelledCount: number = 0;
  selectedView: string = "list";
  filterType: string = "totalRecords"
  isSearch: boolean = false;
  selected: string = "";
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false
  fromDate: any;
  toDate: any;
  toggeledropdown: boolean = false;
  appliedFiltersCount: number = 0;
  maxDate: string | undefined
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
      name: "Change of Nominee",
      value: "nomineeContact",
      selected: false
    },
  ];
  agentCode: any;
  productsList: any = [];
  requestTypes:any =[];
  constructor(private router:Router,
    private endorsementService: EndorsementsRequestsService,
    private _router: Router,
    private datePipe: DatePipe,
    private commonService: CommonService, 
    private languageService: LanguageService,
    private translateService: TranslateService,
    private excelExportService: ExcelExportService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });

    this.getRequestList();
    // this.getProducts();
    this.checkView(); //Screen View check
  }
  /* getProducts() {
    this.agentCode =  localStorage.getItem("agentCode");
    const reqData={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res:any) => {
        this.productsList = res.data;
        const uniqueRequestTypes = Array.from(new Set(this.productsList
         .map((product:any) => product.familyPlan)))
         .map((requestType) => ({ name: requestType, selected: false }));
         this.requestTypes = uniqueRequestTypes;
      },
      error: (err:any) => {
         console.log("error coming form getproduct list API");
      }
    })
  } */

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
    this.checkView(); //Screen View check
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
      "products": [],
      "requestType": [],
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
              ...obj, raisedOn:formattedDate
            }
          });
          this.filterCounts(response?.data);
        } else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        console.error("Error from API:", error);
      }
    );
  }

  
  filterCounts(data: any) {
    this.totalRecords = (data?.[this.filterType] ?? 0);  // Use nullish coalescing to set 0 if null or undefined
    this.activeCount = (data?.activeCount ?? 0);
    this.resolvedCount = (data?.resolvedCount ?? 0);
    this.cancelledCount = (data?.cancelledCount ?? 0);
  }
  

  statusFilter(filter: string, filterRange: string) {
    if (filter === "All") {
      this.requestsListRequestBody.uiStatus = "";
    } else {
    this.requestsListRequestBody.uiStatus = filter;
    }
    this.isSearch = true;
    this.first = 0;
    this.getRequestList();
    this.activeFilter = filter;
    this.filterType = filterRange;
  }

  formatDate(dateType: "fromDate" | "toDate") {
    if (dateType === "fromDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "toDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
  }

  toggleFilterDropdown() {
    this.toggeledropdown = !this.toggeledropdown;
    this.maxDate = new Date().toISOString().split('T')[0];  
  }
  cancel() {
    this.toggeledropdown = false;
  }
  calculateAppliedFiltersCount(){
    const selectedPolicyTypesCount = this.StaticRequestTypes.filter((requestType:any) => requestType.selected).length;
    // const selectedProductsCount = this.productsList.filter((product:any) => product.selected).length;
    let count = selectedPolicyTypesCount;
    if (this.fromDate && this.toDate) {
      count++;
    }
    this.appliedFiltersCount = count;
  }
  clear(){
    // this.productsList.forEach((product:any) => (product.selected = false));
    this.StaticRequestTypes.forEach((requestType) => (requestType.selected = false));
    this.fromDate = null;
    this.toDate = null;
    this.appliedFiltersCount = 0;
    // this.requestsListRequestBody.products = [];
    this.requestsListRequestBody.requestType = [];
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
    // const selectedProducts = this.productsList.filter((product: any) => product.selected)
    //   .map((product: any) => product.productName);
    // if(selectedProducts.length > 0) {
    //   this.requestsListRequestBody.products = selectedProducts;
    // }

    const selectedPolicyTypes = this.StaticRequestTypes.filter((requestType:any) => requestType.selected).map((requestType:any) => requestType.name);
    if(selectedPolicyTypes.length > 0) {
      this.requestsListRequestBody.requestType = selectedPolicyTypes;
    }
  
    this.isSearch = true;
    this.first = 0;
    this.getRequestList();
    this.toggeledropdown=false;
  }

  onSelectChanges(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selected = inputElement.value;
    this.searchInputControl.reset();
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    if (this.selected === "") {
      this.requestsListRequestBody.searchColumn = "";
      this.requestsListRequestBody.searchString = "";
      this.getRequestList();
    }
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched();
  }

  getPlaceholder(): string {
    if (this.selected === "caseId") {
      return "Enter Endorsement Id";
    } else if (this.selected === "memberName") {
      return "Enter Member Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } else if (this.selected === "mobileNumber") {
      return "Enter Mobile Number";
    } else if (this.selected === "emailID") {
      return "Enter Email Id";
    }
    else {
      return "Search...";
    }
  }

  searchInputChange(event: any) {
    const value = event.target.value;
    if(value === '') {
      this.applySearch();
    }
  }
  
  applySearch() {
    const searchValue = this.searchInputControl?.value?.trim();
    if(this.searchInputControl.valid) {
      this.requestsListRequestBody.searchColumn = this.selected;
      this.requestsListRequestBody.searchString = searchValue;
      this.isSearch = true;
      this.first = 0;
      this.getRequestList();
    } else if (searchValue === '') {
      this.requestsListRequestBody.searchColumn = '';
      this.requestsListRequestBody.searchString = '';
      this.isSearch = false;
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

  //Screen View check
  checkView() {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      this.selectedView = 'grid'; 
    }else {
      this.selectedView = 'list'; // Use 'grid' view for desktop
    }
  }

  downloadSingleItem(item: any): void {
    this.excelExportService.exportToExcel([item], `Endorsement_${item.caseId}`);
  }

  downloadAll(): void {
    this.excelExportService.exportToExcel(
      this.endorsementDetails,
      'All_Endorsements'
    );
  }
  
}