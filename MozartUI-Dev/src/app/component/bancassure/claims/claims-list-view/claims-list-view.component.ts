import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

interface Element {
  id: string;
  policyNumber: string;
  productName: string;
  memberName: string;
  memberRelation: string;
  requestType: string;
  claimStatus: string;
  raisedDate: Date;
}


@Component({
  selector: 'app-claims-list-view',
  templateUrl: './claims-list-view.component.html',
  styleUrls: ['./claims-list-view.component.scss'],
})
export class ClaimsListViewComponent implements OnInit {
  displayedColumns: string[] = ['request', 'policyNo', 'productName', 'memberName', 'memberRelation', 'requestType', 'status', 'raisedDate', 'download'];
  allData: Element[] = []; 
  claims = new MatTableDataSource<Element>([]);
  selectedListView: string = '';
  selectedView: string = 'list';
  viewClaims:boolean=false;
  gridClaims:any[] = [];
  gridClaimsData: any[] = [];
  first:number = 0;
  totalRecords:number = 0;
  rows: number = 3;
  page: number = 1;
  selectedStatus = 'All';
  filteredData: any[] = [];
  statuses: string[] = ['All'];
  selectedGrid: boolean = false;
 

  constructor(private http: HttpClient, private router: Router, private commonService: CommonService, private datePipe: DatePipe){
  }
 
  ngOnInit(){
    this.fetchData();   
    this.updateTable();
  }


  claimsView(view:string){
    this.selectedView = view;
  }

  //-------navigate to claims-view ----------
  nav(){
    this.viewClaims = true;
    this.router.navigate(['/portal/agent/list']);
  }
  

//---------pagination------------//

onPageChange(event:any) {
  console.log("page");
    this.first = event.first;
    this.rows = event.rows;
   this.page = Math.floor(this.first/this.rows)+1
   this.updateTable();

}

private updateTable() {
  const startIndex = this.first;
  const endIndex = this.first + this.rows;
  this.claims.data = this.allData.slice(startIndex, endIndex);
  this.totalRecords = this.allData.length;
}


//---------API Call-------//
payload = {
  "sellerId": 5100003,
  "policyNumber": "24-22-8716273-01",
  "productName": "Activ Care V2",
  "sortColumn": "RaisedDate",
  "sortdirection": "DESC",
  "searchType": "string",
  "status": "Active",
  "searchString": "string",
  "pageNumber": 1,
  "pageSize": 10
}
fetchData(): void {
   

  this.commonService.getClaimsList(this.payload).subscribe(res => {
    // this.claims = res.data;

    this.gridClaims = res.data;    
    this.claims.data = this.gridClaims;
    this.allData = this.claims.data
    this.totalRecords = res.data.length

    this.gridClaimsData = this.claims.data;
    console.log('chedk',this.claims.data);
    
  });
}

  // showListView(view:string){
  //   this.selectedListView = view;
  // }
  //-------filters-------------//
  // filterClaims(status:string){    
    
  //   if(status === 'all'){
  //     this.claims.data = this.gridClaims
  //   }
  //   else if(status === 'resolved'){
  //     this.claims.data = this.gridClaims.filter(claim=> claim.claimStatus === 'Settled' || 'Approved');
  //   }
  //   else if(status === 'active'){
  //     this.claims.data = this.gridClaims.filter(claim=> claim.claimStatus === 'payment Rejected');
  //   }
  //   else{
  //     this.claims.data = this.gridClaims.filter(claim=> claim.claimStatus === status )
  //   }
  // }

  //-----------search dropdown----------//




  filterClaims(status: string) {
    this.selectedGrid = true;
    console.log('check')
    const lowerCaseStatus = status.toLowerCase();
  
    if (lowerCaseStatus === 'all') {
      this.claims.data = this.gridClaims;
      this.gridClaimsData = this.gridClaims;
    }  
    else if (lowerCaseStatus === 'resolved') {
      this.claims.data = this.gridClaims.filter(claim =>
        claim.claimStatus === 'Intimated' || claim.claimStatus === 'approved'
      );

      this.gridClaimsData = this.gridClaims.filter(gridClaim =>
        gridClaim.claimStatus === 'Intimated' || gridClaim.claimStatus === 'approved'
      );
      console.log('grid',this.gridClaimsData);


    } 
    else if (lowerCaseStatus === 'active') {
      this.claims.data = this.gridClaims.filter(claim =>
        claim.claimStatus === 'Payment Rejected' || claim.claimStatus === 'Pending Approval'
       );

       this.gridClaimsData = this.gridClaims.filter(gridClaim =>
        gridClaim.claimStatus === 'Payment Rejected' || gridClaim.claimStatus === 'Pending Approval'
        );
        console.log('grid',this.gridClaimsData);

      
    } else {
      this.claims.data = this.gridClaims.filter(claim =>
        claim.claimStatus === status
      );
      this.gridClaimsData = this.gridClaims.filter(gridClaim => 
        gridClaim.claimStatus === status
      );
      console.log('grid',this.gridClaimsData);

      
    }
  }
  
 
}
