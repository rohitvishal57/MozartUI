import { Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

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
  agentCode :any = '';
  constructor(
    private performanceService: PerformanceService, private languageService: LanguageService,
    private translateService: TranslateService

  ) { }
  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.agentCode = storedAgentCode;
    }
    this.getPerformanceData();
    this.getPerformanceDetailedViewCount();
    this.getPerformanceDetailedList();
  }

  getPerformanceData() {
    let reqObj = {
        agentCode: this.agentCode
    }
    this.performanceService.getPerformanceDataApi(reqObj).subscribe(
      (response) => {
        // if (response.isSuccess == true && response.statusCode == "200") {
        if (response) {
        this.agentPerformanceData = response.data;
        this.annualClubPerformance = response.data.annualClubPermormance;
        this.campaignPerformance = response.data.campaignPermormance;
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
      agent_Code: this.agentCode,
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
      agentCode: this.agentCode,
      start: this.page,
      length: this.rows,
      isViewed: true
  }
  this.performanceService.getPerformanceDetailedViewList(reqObj).subscribe(
    (response) => {
      // if (response.isSuccess == true && response.statusCode == "200") {
        if (response) {
        this.detailedList = response?.data?.agentProposalsDetailedViewLists||[];
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
