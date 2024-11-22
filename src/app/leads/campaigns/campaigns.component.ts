import { Component } from '@angular/core';
import { Constants } from '../constants';
import { LeadsService } from '../leads.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent {
  countsList: any = [];
  campaignList: any = [];
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  selectedView: string = "list";
  totalRecords: number = 0;
  agentCode=localStorage.getItem('agentCode');
  campaignsLisRequestBody={
    "agentCode": this.agentCode,
    "leadId": "",
    "productName": "",
    "startDate": null,
    "pageNumber": 1,
    "pageSize": 10,
    "name": "",
    "email": "",
    "mobileNumber": "",
    "filterType": ""
  }
  constructor(private leadsService: LeadsService,){
    
  }
  ngOnInit(): void {
    // this.countsList = [];
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.campaignsLisRequestBody.agentCode = storedAgentCode;
      this.getLeadsList();
    }
    else{
      console.log("agent code is not present in local storege");
    }
  }
  getLeadsList() {
    this.campaignsLisRequestBody.pageNumber = this.page;
    this.campaignsLisRequestBody.pageSize = this.rows;
    this.leadsService.getLeadsListApi(this.campaignsLisRequestBody).subscribe(
      (response) => { 
        console.log(response.data);
        if (response.success) {
          this.campaignList = response.data.leadList,
          console.log("Campaigns List",this.campaignList);
          this.countsList = response.data;
          this.totalRecords = this.countsList.totalRecords;
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  campaignListView(view: string) {
    this.selectedView = view;
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getLeadsList();
  }
}
