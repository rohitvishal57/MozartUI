import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ClaimsInterface } from 'src/app/interface/claims.interface';



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
  viewClaims:boolean=false;
  gridClaims:any[] = [];
  gridClaimsData: any[] = [];
  first:number = 0;
  totalRecords:number = 0;
  rows: number = 5;
  page: number = 1;
  selectedStatus = 'all';
  filteredData: any[] = [];
  statuses: string[] = ['All'];
  selectedGrid: boolean = false;
  toggledropdown: boolean = false;
  toggleSearchdropdown: boolean = false;
  searchInputControl = new FormControl("");
  selected: string = "";

  constructor(private http: HttpClient, private router: Router, private commonService: CommonService, private datePipe: DatePipe){
  }
 
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
   // this.updateTable();
}

// private updateTable() {
//   const startIndex = this.first;
//   const endIndex = this.first + this.rows;
//   ///this.claims.data = this.allData.slice(startIndex, endIndex);
//   console.log("this.claims.data ",this.claims.data )
//   this.totalRecords = this.allData.length;
// }


//---------API Call-------//
payload = {
  "sellerId": 5100003,
  "policyNumber": "",
  "productName": "",
  "memberName" : "",
  "sortColumn": "RaisedDate",
  "searchType": "string",
  "sortdirection": "DESC",
  "status": "All",
  "searchString": "string",
  "pageNumber": 1,
  "pageSize": 10
}

fetchData(): void {
  this.commonService.getClaimsList(this.payload).subscribe(res => {
    this.gridClaims = res.data;   
    this.gridClaimsData = res.data; 
    this.claims = [...this.gridClaims]; 
    this.gridClaimsData = this.claims;
    this.totalRecords = this.gridClaims.length;
  });
}

  //-----------search dropdown----------//
  toggleSearchDropdown(){
    if(this.toggledropdown==true)
      {
        this.toggledropdown=false;
      }
      this.toggleSearchdropdown = !this.toggleSearchdropdown;
  }

  cancelSearch() {
    this.toggleSearchdropdown = false;
    this.selected = "";
    this.payload.policyNumber=""
    this.payload.productName=""
    this.payload.memberName=""
    this.fetchData()
  }

  applySearch() {
    if (this.searchInputControl.valid) {
      if (this.selected === "policyNumber") {
        this.payload.policyNumber =this.searchInputControl.value!;
        console.log(this.payload.policyNumber);
      } 
      else if (this.selected === "productName") {
        this.payload.productName = this.searchInputControl.value!;
      }
      else if (this.selected === "memberName") {
        this.payload.memberName = this.searchInputControl.value!;
      }
      this.fetchData();
      this.toggleSearchdropdown = false;
    } 
    else {
      this.toggleSearchdropdown = true;
    }
  }

  onSelectChanges(event: any): void {
    event.stopPropagation(); // Prevents the menu from closing
    this.selected !== "none";
    console.log("selected value", this.selected);
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();
  
    if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[6-9][0-9]{9}$"),
      ]);
    } 
    else if (this.selected === "productName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    } 
    else if (this.selected === "memberName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$"),
      ]);
    } 

    
    this.searchInputControl.updateValueAndValidity();
    this.searchInputControl.markAsUntouched(); 
  }

  getPlaceholder(): string {
    if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } else if (this.selected === "memberName") {
      return "Enter Member Name";
    } else if (this.selected === "productName") {
      return "Enter Product Number";
    } 
    else {
      return "";
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
