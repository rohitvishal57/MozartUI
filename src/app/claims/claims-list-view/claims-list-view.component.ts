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
  productsList: any[] = [];
  requestTypes: any[] = [];
  agentCode = localStorage.getItem('agentCode')
  StaticRequestTypes = [
    { name: 'Cashless', selected: false },
    { name: 'Reimbursement', selected: false },
  ];
  
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
    this.fetchData();
    this.selectedStatus = status;
  }

//---------pagination------------//
onPageChange(event:any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first/this.rows)+1
}

getFromDate(event:any){
  this.fromDate = event.target.value;
}

getToDate(event:any){
  this.toDate = event.target.value;
}

//---------API Call-------//
claimsReqBody =  {
    "sellerId": this.agentCode,
    "sortColumn": "ReportedDateTime",
    "sortdirection": "ASC",
    "status": "reimbursement",
    "requestType": "",
    "searchType": "",
    "searchString": "",
    "pageNumber": 1,
    "pageSize": 270,
    "fromDate": null,
    "toDate": null
  }
fetchData(): void {
  this.claimsService.getClaimsList(this.claimsReqBody).subscribe((res : any) => { 
    this.claims = res.data;       
    this.gridClaimsData = res.data; 
    this.totalRecords = this.claims.length;    
  });
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

  getProducts() {
    const reqData={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
        console.log("product list",this.productsList)
        const uniqueRequestTypes = Array.from(new Set(this.productsList
         .map((product) => product.familyPlan)))
         .map((requestType) => ({ name: requestType, selected: false }));
         this.requestTypes = uniqueRequestTypes;
      },
      error: (err) => {
         console.log("error coming form getproduct list API");
      }
    })
  }
  calculateAppliedFiltersCount(){
    const selectedPolicyTypesCount = this.StaticRequestTypes.filter(
      (requestType) => requestType.selected).length;
      // const selectedProductsCount = this.productsList.filter(
      //   (product) => product.selected).length;
        let count = selectedPolicyTypesCount;
        if (this.fromDate && this.toDate) {
          count++;
        }
        this.appliedFiltersCount = count;
         this.appliedFiltersCount;
  }

  applyFilter() {
    this.calculateAppliedFiltersCount();
  this.formatDate("fromDate");
  this.formatDate("toDate");
  this.claimsReqBody.fromDate=this.fromDate;
  this.claimsReqBody.toDate=this.toDate;
  const selectedPolicyTypes = this.StaticRequestTypes
  .filter((requestType:any) => requestType.selected)
  .map((requestType:any) => requestType.name);
  this.claimsReqBody.requestType = selectedPolicyTypes.join(", ");
  this.fetchData();
  this.getProducts();
  this.toggeledropdown=false;
}

cancel() {
  this.fromDate = null;
  this.toDate = null;
  this.claimsReqBody.fromDate = null;
  this.claimsReqBody.toDate = null;
  this.toggeledropdown = false;
  this.fetchData();
}

clear(){
  this.productsList.forEach((product) => (product.selected = false));
  this.StaticRequestTypes.forEach((requestType) => (requestType.selected = false));
  this.fromDate = null;
  this.toDate = null;
  this.appliedFiltersCount = 0;
 // this.claimsReqBody.productName = "";
  this.claimsReqBody.requestType = "";
  this.claimsReqBody.fromDate = null;
  this.claimsReqBody.toDate = null;
  this.fetchData();
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
      this.claimsReqBody.searchString = searchValue;

      this.fetchData();
     // this.toggleSearchdropdown = false;
    //  this.claimsReqBody.searchType = '';
      this.claimsReqBody.searchString = '';
      console.log('searchvalue', this.claimsReqBody.searchString);
      console.log('searchtype', this.claimsReqBody.searchType);    
    }
    else if(searchValue === ''){  
      this.selected = '';
      this.searchInputControl.setValue('');
      this.claimsReqBody.searchType = '';
      this.claimsReqBody.searchString = '';
      this.fetchData();      
    }
    else{
      this.fetchData();
    }
    this.selected = '';
    this.searchInputControl.reset();
  }

onSelectChanges(event: any): void {
  //event.stopPropagation(); 
  this.selected !== "none";
  this.searchInputControl.setValue('');
  this.searchInputControl.clearValidators();

  if (this.selected === 'policyNumber' || this.selected === 'productName' || this.selected === 'requestType') {
    this.searchInputControl.setValidators([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9@#$%^&*! ]*$')
    ]);
  }    
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched(); 
  }

getPlaceholder(): string {
  if (this.selected === 'policyNumber') {
      return 'Enter Policy Number';
    } else if (this.selected === 'productName') {
      return 'Enter Product Name';
    } else if (this.selected === 'requestType') {
      return 'Enter Request Type';
    }
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