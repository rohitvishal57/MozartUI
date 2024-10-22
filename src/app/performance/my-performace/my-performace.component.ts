import { Component } from '@angular/core';
import { PerformanceService } from '../performance.service';

@Component({
  selector: 'app-my-performace',
  templateUrl: './my-performace.component.html',
  styleUrls: ['./my-performace.component.scss']
})
export class MyPerformaceComponent {
  selectedTabIndex: number = 0;
  docType = 'Monthly';
  detailedList: any;
  selectedView: string = "list";
  // docType: string = "Monthly";
  annualClubPerformance: any;
  campaignPerformance: any;
  agentPerformanceData: any;
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  constructor(
    private performanceService: PerformanceService,

  ) { }
  ngOnInit(): void {
    this.getPerformanceData();
    this.getPerformanceDetailedViewCount();
    this.getPerformanceDetailedList();
  }

  getPerformanceData() {
    let reqObj = {
        agentCode: "ABH1102376"
    }
    this.performanceService.getPerformanceDataApi(reqObj).subscribe(
      (response) => {
        if (response.isSuccess == true && response.statusCode == "200") {
          this.agentPerformanceData = response;
        this.annualClubPerformance = response.annualClubPermormance;
        this.campaignPerformance = response.campaignPermormance;
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  getPerformanceDetailedViewCount() {
    let reqObj = {
      agent_Code: "ABH1101006",
      isViewed: true
  }
  this.performanceService.getPerformanceDetailedViewLatestCount(reqObj).subscribe(
    (response) => {

      if (response.isSuccess == true && response.statusCode == "200") {
      }
      else { console.error("API request was not successful."); }
    },
    (error) => {
      console.error("Error from getRenewalsList API:", error);
    }
  );
  }
  getPerformanceDetailedList(){
    let reqObj = {
      agentCode: "ABH1101006",
      start: this.page,
      length: this.rows,
      isViewed: true
  }
  this.performanceService.getPerformanceDetailedViewList(reqObj).subscribe(
    (response) => {
      if (response.isSuccess == true && response.statusCode == "200") {
        this.detailedList = response.agentProposalsDetailedViewLists;
      }
      else { console.error("API request was not successful."); }
    },
    (error) => {
      console.error("Error from getRenewalsList API:", error);
    }
  );
  }
  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
    console.log(this.selectedTabIndex);
    if(this.selectedTabIndex == 1){

    }
  }
  toggleView(key: any){
    console.log(key);
    this.docType = key;
  }
}
