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
  toggledropdown: boolean = false;
  toggleSearchdropdown: boolean = false;
  searchInputControl = new FormControl("");
  selected: string = "";
  userId!: number;
  constructor(private http: HttpClient, private router: Router, private commonService: CommonService, private datePipe: DatePipe, private claimsService:ClaimsViewService){ }

  ngOnInit(){
    this.fetchData(); 
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

//---------API Call-------//
claimsReqBody =  {
    "sellerId": localStorage.getItem('agentCode'),
    "sortColumn": "ReportedDateTime",
    "sortdirection": "DESC",
    "status": "All",
    "searchType": "string",
    "searchString": "string",
    "pageNumber": 1,
    "pageSize": 10 
  }
fetchData(): void {
  this.claimsService.getClaimsList(this.claimsReqBody).subscribe((res:any) => {
    this.claims = res.data;       
    this.gridClaimsData = res.data; 
    this.totalRecords = this.claims.length;    
  });
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
}
