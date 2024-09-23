import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ClaimsInterface } from 'src/app/interface/claims.interface';
import { ClaimsService } from 'src/app/services/claims/claims.service';



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
  first:number = 0;
  totalRecords:number = 0;
  rows: number = 10;
  page: number = 1;
  selectedStatus = 'all';
  filteredData: any[] = [];
  statuses: string[] = ['All'];
  selectedGrid: boolean = false;
  toggledropdown: boolean = false;
  toggleSearchdropdown: boolean = false;
  searchInputControl = new FormControl("");
  selected: string = "search";
  userId!: number;
  constructor(private http: HttpClient, private router: Router, private commonService: CommonService, private datePipe: DatePipe, private claimsService:ClaimsService){ }

  ngOnInit(){
    this.fetchData(); 
  }

  claimsView(view:string){
    this.selectedView = view;
  }

  //-------navigate to My-claims-view ----------
  navigateToMyClaim(){
    this.viewClaims = true;
    this.router.navigate(['/portal/agent/list']);
  }

//---------pagination------------//

onPageChange(event:any) {
  console.log("page");
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first/this.rows)+1
    console.log("this.first",this.first);
    console.log("this.ros",this.rows);
}

//---------API Call-------//
payload =  {
    "sellerId": localStorage.getItem('agentCode'),
    "sortColumn": "RaisedDate",
    "sortdirection": "DESC",
    "status": "All",
    "searchType": "",
    "searchString": "",
    "pageNumber": 1,
    "pageSize": 10
  }
fetchData(): void {
  this.claimsService.getClaimsList(this.payload).subscribe(res => {
    this.gridClaims = res.data;   
    this.gridClaimsData = res.data; 
    this.claims = [...this.gridClaims]; 
    this.gridClaimsData = this.claims;
    this.totalRecords = this.gridClaims.length;
  });
  }

  //-----------search dropdown----------//
  toggleSearchDropdown(event: any){
    if(this.toggledropdown==true)
      {
        this.toggledropdown=false;
      }
      this.toggleSearchdropdown = !this.toggleSearchdropdown;
  }

  applySearch(): void {
    let searchValue = this.searchInputControl.value?.trim();
    console.log("this.searchInputControl.value",this.searchInputControl.value)
    if (searchValue) {
      this.payload.searchType = this.selected;
      console.log("this.payload.searchType",this.payload.searchType)
      this.payload.searchString = searchValue;
      console.log("his.payload.searchString ",this.payload.searchString )
      this.fetchData();
      this.toggleSearchdropdown = false;
    } else if(searchValue === ''){
      
    this.selected = '';
    this.searchInputControl.setValue('');
    this.payload.searchType = '';
    this.payload.searchString = '';
    this.fetchData();
      
    }
    else{
      this.fetchData();
    }
  }

  // cancelSearch(): void {
  //   this.toggleSearchdropdown = false;
  //   this.selected = '';
  //   this.searchInputControl.setValue('');
  //   this.payload.searchType = '';
  //   this.payload.searchString = '';
  //   this.fetchData();
  // }
  onSelectChanges(event: any): void {
  //  event.stopPropagation(); // Prevents the menu from closing
  this.selected = event.value;
  console.log("In selection change", this.selected)
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
  menuClosed(): void {
    
  }

//-------------filters--------------//
filterClaims(status: string) {
  this.selectedStatus = status.toLowerCase();

  if (this.selectedStatus === 'all') {
    this.claims = [...this.gridClaims];
    this.gridClaimsData = [...this.claims];
  } else if (this.selectedStatus === 'resolved') {
    this.claims = this.gridClaims.filter(claim =>
      claim.claimStatus === 'Intimated' || claim.claimStatus === 'approved'
    );
    this.gridClaimsData = this.gridClaims.filter(gridClaim =>
      gridClaim.claimStatus === 'Intimated' || gridClaim.claimStatus === 'Intimated'
    );
  } else if (this.selectedStatus === 'active') {
    this.claims = this.gridClaims.filter(claim =>
      claim.claimStatus === 'Payment Rejected' || claim.claimStatus === 'Pending Approval'
    ); 
    this.gridClaimsData = this.gridClaims.filter(gridClaim =>
      gridClaim.claimStatus === 'Payment Rejected' || gridClaim.claimStatus === 'Pending Approval'
    );

  } else {
    this.claims = this.gridClaims.filter(claim =>
      claim.claimStatus === 'Cancelled'
    );
    this.gridClaimsData = this.gridClaims.filter(gridClaim =>
      gridClaim.claimStatus === 'Cancelled'
    );
  }
}
   
}
