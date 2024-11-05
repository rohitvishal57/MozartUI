import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ClaimsInterface } from 'src/app/interface/claims.interface';
import { ClaimsViewService } from '../claims-view/claims-view.service';


@Component({
  selector: 'app-claims-list-view',
  templateUrl: './claims-list-view.component.html',
  styleUrls: ['./claims-list-view.component.scss'],
  //encapsulation: ViewEncapsulation.Emulated,
})
export class ClaimsListViewComponent implements OnInit {
  displayedColumns: string[] = ['request', 'policyNo', 'productName', 'memberName', 'memberRelation', 'requestType', 'status', 'raisedDate', 'download'];
  allData: ClaimsInterface[] = []; 
  claims: any[] = [];
  selectedListView: string = '';
  selectedView: string = 'list';
  viewClaims:boolean=false;
  gridClaims:any[] = [];
  gridClaimsData: any[] = [];
  first: number = 0;
  totalRecords: number = 0;
  rows: number = 10;
  page: number = 1;
  selectedStatus = 'all';
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
  isSearch:boolean = false;
  productsList:any;
  agentCode = localStorage.getItem('agentCode')
  StaticRequestTypes = [
    { name: 'Cashless', selected: false },
    { name: 'Reimbursement', selected: false },
  ];
  // statuses = [
  //   { name: 'Intimated', selected: false },
  //   { name: 'Inward Completed	', selected: false },
  //   { name: 'RI Registration Raised', selected: false},
  //   { name: 'Approved', selected: false},
  //   { name: 'Scanning Completed', selected: false},
  //   { name: 'Cancelled', selected: false}
  // ]
  
  constructor(private http: HttpClient, private router: Router, private commonService: CommonService, private datePipe: DatePipe, private claimsService:ClaimsViewService){ }

  ngOnInit(){
    this.fetchData(); 
    this.getProducts();
  }

  claimsView(view:string){
    this.selectedView = view;
  }

  //-------navigate to My-claims-view ----------
  navigateToCreateClaim(){
    this.viewClaims = true;
    this.router.navigate(['claims/createClaims']);
  }

  //-------------filters--------------//
  filterClaims(status: string) {
    this.claimsReqBody.status = status;
    this.first = 0;
    this.selectedStatus = status;
    this.fetchData();
  }

//---------pagination------------//
onPageChange(event:any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first/this.rows)+1
    this.isSearch = false;
    this.fetchData();
}

getFromDate(event:any){
  this.fromDate = event.target.value;
}

getToDate(event:any){
  this.toDate = event.target.value;
}

//---------API Call-------//
claimsReqBody =  {
    "agentCode": this.agentCode,
    "sortColumn": "ReportedDateTime",
    "sortdirection": "DESC",
    "status": "",
    "requestType": "",
    "searchType": "",
    "searchString": [""],
    "start": 1,
    "pageSize": 10,
    "fromDate": null,
    "toDate": null
  }

fetchData(): void {
  if (!this.isSearch) {
    this.claimsReqBody.start = (this.page - 1) * this.rows;
    this.claimsReqBody.pageSize = this.rows;
  } else {
    this.claimsReqBody.start = 0;
  }
  this.claimsService.getClaimsList(this.claimsReqBody).subscribe((res : any) => { 
    if (res.data && res.statusCode == "200" && res.isSuccess) {
    this.claims = res.data.claimDetails;      
   // this.productsList = res.claimDetails     
    this.gridClaimsData = res.data.claimDetails; 
    this.totalRecords = res.data.totalRecords;    
}
else{
  console.error("API request was not successful.");
}
});

  }

  formatDate(dateType: "fromDate" | "toDate") {
    if (dateType === "fromDate" && this.fromDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    } else if (dateType === "toDate" && this.toDate) {
      this.toDate = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    }
    if(this.toDate < this.fromDate) {
      this.toDate = "";
    }
  }


  toggleFilterDropdown() {
    if(this.toggeleSearchdropdown==true)
    {
       this.toggeleSearchdropdown=false;
    }
    this.toggeledropdown = !this.toggeledropdown;   
    this.maxDate = new Date().toISOString().split('T')[0];  
 
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

  calculateAppliedFiltersCount() {
    const selectedPolicyTypesCount = this.StaticRequestTypes 
      ? this.StaticRequestTypes.filter((requestType) => requestType.selected).length
      : 0;
  
    const selectedProductsCount = this.productsList 
      ? this.productsList.filter((product: any) => product.selected).length
      : 0;
  
    let count = selectedPolicyTypesCount + selectedProductsCount;
  
    if (this.fromDate && this.toDate) {
      count++;
    }
  
    this.appliedFiltersCount = count || 0;
  }
  

  

cancel() {
  // this.fromDate = null;
  // this.toDate = null;
  // this.claimsReqBody.fromDate = null;
  // this.claimsReqBody.toDate = null;
  this.toggeledropdown = false;
 // this.fetchData();
}

applyFilter() {
  this.selected = "";
  this.searchInputControl.reset();
  this.calculateAppliedFiltersCount();
  this.formatDate("fromDate");
  this.formatDate("toDate");

  this.claimsReqBody.fromDate = this.fromDate;
  this.claimsReqBody.toDate = this.toDate;

  const selectedPolicyTypes = this.StaticRequestTypes 
    ? this.StaticRequestTypes.filter((requestType: any) => requestType.selected).map((requestType: any) => requestType.name)
    : [];

  if (selectedPolicyTypes.length === this.StaticRequestTypes.length || selectedPolicyTypes.length === 0) {
    this.claimsReqBody.requestType = "";
  } else {
    this.claimsReqBody.requestType = selectedPolicyTypes.join(", ");
  }

  // selected products
  const selectedProducts = this.productsList 
    ? this.productsList.filter((product: any) => product.selected).map((product: any) => product.productName)
    : [];

  if (selectedProducts.length === this.productsList?.length || selectedProducts.length === 0) {
    this.claimsReqBody.searchType = "";
    this.claimsReqBody.searchString = [""];
  } else {
    this.claimsReqBody.searchType = "productName";
    this.claimsReqBody.searchString = selectedProducts.join(", ");
  }

  this.first = 0;
  this.fetchData();
  this.toggeledropdown = false; 
}


clear() {
  if (this.productsList) {
    this.productsList.forEach((product: any) => (product.selected = false));
  }

  if (this.StaticRequestTypes) {
    this.StaticRequestTypes.forEach((requestType: any) => (requestType.selected = false));
  }

  this.fromDate = null;
  this.toDate = null;
  this.appliedFiltersCount = 0;

  // Clear request body filters
  this.claimsReqBody.requestType = "";
  this.claimsReqBody.searchType = "";
  this.claimsReqBody.searchString = [];
  this.claimsReqBody.fromDate = null;
  this.claimsReqBody.toDate = null;

  this.fetchData();
  this.toggeledropdown = false;
}

  //-----------search dropdown----------//
  // toggleSearchDropdown(event: any){
  //   if(this.toggledropdown==true)
  //     {
  //       this.toggledropdown=false;
  //     }
  //     this.toggleSearchdropdown = !this.toggleSearchdropdown;
  // }

  applySearch(): void {
    let searchValue = this.searchInputControl.value?.trim();
    if (searchValue) {
      this.claimsReqBody.searchType = this.selected;
      this.claimsReqBody.searchString = [searchValue];    
    }
    this.isSearch = true;
    this.fetchData();
    this.first = 0;
    
  }

onSelectChanges(event: any): void {
  //event.stopPropagation(); 
  // this.selected !== "";
  this.searchInputControl.setValue('');
  this.searchInputControl.clearValidators();

  // if (this.selected === 'mobileNumber') {
  //   this.searchInputControl.setValidators([
  //     Validators.required,
  //     Validators.pattern('^[0-9]*$') 
  //   ]);
  // }
   if (this.selected === 'claimInfoId' || this.selected === 'policyNumber' || this.selected === 'memberId') {
    this.searchInputControl.setValidators([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9@#$%^&*! ]*$') 
    ]);
  }
  else {
    this.claimsReqBody.searchString = ['']
    this.claimsReqBody.searchType = ''

    this.fetchData();
  }
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched(); 
  }

getPlaceholder(): string {
  if (this.selected === 'policyNumber') {
      return 'Enter Policy Number';
    } else if (this.selected === 'claimInfoId') {
      return 'Enter Request ID';
    } else if (this.selected === 'memberId') {
      return 'Enter Member ID';
    }
    //  else if (this.selected === 'mobileNumber') {
    //   return 'Enter Mobile Number';
    // } else if (this.selected === 'memberId') {
    //   return 'Enter Member Id';
    // }
  else {
      return 'Search...';
    }
  } 
  
  // toggleDropdown(row: any) {
  //   if (this.selectedClaim && this.selectedClaim.id === row.id) {
  //     this.selectedClaim = null; 
  //   } else {
  //     this.selectedClaim = row;
  //   }
  // }
 // maskPhoneNumber(policyNumber: string) {
    // if (!policyNumber || policyNumber.length < 4) {
    //   return policyNumber; 
    // }
    
    // const start = policyNumber.slice(0, 4); 
    // const end = policyNumber.slice(-2);
    // const masked = '******';
    
    // return `${start}${masked}${end}`;
  //}
  navigateToViewClaim(row:any){
    let claimDetailsReqBody = {
      "id": row.id,
      "claimNumber": row.claimInfoId,
      "policyNumber": row.policyNumber
    };
    this.claimsService.getClaimDetailsView(claimDetailsReqBody).subscribe(
      (response) => {
        this.router.navigate([`/claims/detailsView/${row.id}/${row.claimInfoId}/${row.policyNumber}`]);
        // this.router.navigate([`/claims/detailsView`], {
        //   queryParams: {
        //     id: row.id,
        //     claimNumber: '',
        //     policyNumber: row.policyNumber
        //   }
        // });
      },
      (error) => {
        console.error('Error fetching claim details', error);
       
      }
    );
  }
  
  
}