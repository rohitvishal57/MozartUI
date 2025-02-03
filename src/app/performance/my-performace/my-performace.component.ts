import { Component, ViewChild } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';

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
  commissionForm!: FormGroup;
  years: any;
  months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  cycles: any = [
    {
      "name": "Cycle: 1st (1st to 15th of the month)",
      "value": "MID"
    },
    {
      "name": "Cycle: 2nd (16th to End of the month)",
      "value": "END"
    }
  ];
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  constructor(
    private activatedRoute : ActivatedRoute,
    private performanceService: PerformanceService, private languageService: LanguageService,
    private translateService: TranslateService,private formBuilder: FormBuilder,private toast: NgToastService
  ) { }
  ngOnInit(): void {
    window.scrollTo(0, 0); // Scroll to top when the component is initialized
    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear - 1]
    this.inItForm();
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

  ngAfterViewInit(){
    this.activatedRoute.queryParams.subscribe((params : any) => {
      let routeLeadStatus  = params['status'];
      this.tabGroup.selectedIndex = routeLeadStatus;
    });
  }


  inItForm() {
    this.commissionForm = this.formBuilder.group({
      year: [''],
      month: [''],
      cycle: ['']
    });
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


  fetchCommissionStatement() {
    let requestbody: any = this.commissionForm.getRawValue();
    requestbody.agentCode = this.agentCode;
    requestbody.type = 'CommissionStatement';
    this.performanceService.fetchCommissionStatement(requestbody).subscribe(
      (respose) => {
        if (respose.isSuccess) {
          let commissionDetails = respose?.data?.searchResponse[0];
          if(commissionDetails.fileName && commissionDetails.omniDocIndex){
            this.downloadStatement(commissionDetails.omniDocIndex, commissionDetails.fileName);
          }else{
            this.toast.warning({ detail: "Warning", summary: 'There are no commission statements to download.', duration: 2000 }); 
          }
        }else{
          this.toast.warning({ detail: "Warning", summary: 'Failed to fetch commission statement.', duration: 2000 });
        }
      },
      (error) => {
        console.log('Failed to fetch commission statement', error);
        this.toast.error({ detail: "Error", summary: 'Failed to fetch commission statement.', duration: 2000 });
      });
  }

  downloadStatement(omniDocImageIndex: string, fileName: string) {
    let requestBody: any = {};
    requestBody.agentCode =  this.agentCode;
    requestBody.downloadRequest = [{
      omniDocImageIndex: omniDocImageIndex,
      fileName: fileName
    }];

    this.performanceService.downloadCommissionStatement(requestBody).subscribe(
      (response) => {
        try{
          if (response.isSuccess) {
            const blob = this.base64ToBlob(response?.data?.downloadResponse[0]?.byteArray, 'application/pdf');
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.toast.success({ detail: "Success", summary: 'Commission Statement Downloaded Successfully.', duration: 2000 }); 
          }else{
            this.toast.warning({ detail: "Warning", summary: 'Failed to download commission statement.', duration: 2000 });
          }
        }catch(error){
          console.log('errror download pdf',error);
        }
      }, (error) => {
        console.log('Failed to download commission statement', error);
        this.toast.error({ detail: "Error", summary: 'Failed to download commission statement.', duration: 2000 });
      });

  }

  base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const length = binary.length;
    const arrayBuffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      arrayBuffer[i] = binary.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type });
  }
}
