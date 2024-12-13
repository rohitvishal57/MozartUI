import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { PerformanceService } from 'src/app/performance/performance.service';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NgToastService } from 'ng-angular-popup';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
  agentCode: any = '';
  profileDetails: any;
  EcalatinDetails: any[] = [];
  showmsg: boolean = false;
  selectedLanguage: string = '';
  profileLink:any = '';

  constructor(
    private performanceService: PerformanceService, private languageService: LanguageService,
    private translateService: TranslateService, private profileService: ProfileService, private toast: NgToastService

  ) { }
  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData.preferredLanguage) {
        this.selectedLanguage = parsedUserData.preferredLanguage;
      }
    }

    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.agentCode = storedAgentCode;
    }
    this.getPerformanceData();
    this.getPerformanceDetailedViewCount();
    this.getPerformanceDetailedList();
    this.getEscalationMatrixDetails();
    

    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }
    this.profileService.getProfileDetails(reqData).subscribe((res: any) => {
      if (res.isSuccess) {
        // this.profileDetails = res.data;
        const output = Object.keys(res.data).map(key => ({
          heading: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase()), // Capitalize heading
          icon: this.getIcons(key),
          value: key === 'dateOfBirth' ? new Date(res.data[key]).toLocaleDateString('en-US') : res.data[key]
        }));
        this.profileDetails = output;
        this.profileDetails = output.filter(item => item.heading !== 'Profile Link');
        this.profileLink = res.data.profileLink;
      }
    })
  }

  getIcons(key: string) {
    switch (key) {
      case 'agentCode':
      case 'parentCode':
      case 'branchOfficeCode':
      case 'spCode':
      case 'branchOfficeName':
      case 'smCode':
        return 'icon_branch_office';
        break;
      case 'firstName':
      case 'lastName':
      case 'middleName':
      case 'spName':
      case 'smName':
        return 'name';
        break;
      case 'mobileNumber':
      case 'spMobile':
      case 'alternateMobileNumber':
      case 'smMobile':
        return 'phone';
        break;
      case 'smEmail':
      case 'emailId':
      case 'spEmail':
      case 'alternateEmailId':
        return 'email';
        break;
      case 'gender':
        return 'gender';
        break;
      case 'dateOfBirth':
        return 'dob';
        break;
      case 'agentCategory':
        return 'spouse';
        break;
      case 'subChannel':
        return 'icon_sub_channel';
        break;
      case 'parentName':
        return 'icon_parent_name';
        break;

      default:
        return 'spouse'
        break;
    }
  }

  updatePreferredLanguage(): void {
    const reqData = {
      AgentCode: this.agentCode,
      LanguagePreference: this.selectedLanguage,
    };

    console.log('Request Data:', reqData);

    this.profileService.updatePreferredLanguage(reqData).subscribe({
      next: (response: any) => {
        console.log('Language preference updated successfully:', response);
        this.toast.success({ detail: 'SUCCESS', summary: response.message, duration: 3000 });
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          parsedUserData.preferredLanguage = this.selectedLanguage;
          localStorage.setItem('userData', JSON.stringify(parsedUserData));
        }
        this.toast.success({ detail: "SUCCESS", summary: "Success", duration: 3000 })
      },
      error: (error) => {
        console.error('Error updating language preference:', error);
        this.toast.error({
          detail: "Error",
          summary: error.message || "Not Updating the language preference.",
          duration: 3000,
        });
      },
    });
  }
  getEscalationMatrixDetails() {
    let reqObj = {
      agentCode: this.agentCode
    };
    this.profileService.getEscalationMatrixDetails(reqObj).subscribe((res) => {
      if (res && res.data && res.data.length > 0) {
        this.EcalatinDetails = res.data.sort((a: any, b: any) => {
          return a.level.localeCompare(b.level);
        });
        this.showmsg = false;
        console.log("Escalation Details", this.EcalatinDetails);
      } else {
        this.EcalatinDetails = [];
        this.showmsg = true;
        console.log("Escalation Matrix Details Not Found");
      }
    });
  }
  
  copyToClipboard(): void {
    const urlElement = document.getElementById('qrCodeUrl');
    if (urlElement) {
      const urlText = urlElement.textContent || '';
      navigator.clipboard.writeText(urlText).then(
        () => {
          console.log('URL copied to clipboard:', urlText);
          this.toast.success({ detail: "SUCCESS", summary: "URL copied to clipboard!", duration: 3000 })
        },
        (error) => {
          console.error('Failed to copy URL:', error);
          this.toast.error({
            detail: "Error",
            summary: error.message || "Failed to copy URL.",
            duration: 3000,
          });
        }
      );
    }
  }
  openLink(): void {
    const urlElement = document.getElementById('qrCodeUrl');
    if (urlElement) {
      const url = urlElement.textContent || '';
      if (url) {
        window.open(url, '_blank'); // Opens the URL in a new tab
      } else {
        (error:any) => {
          console.error('Failed to copy URL:', error);
          this.toast.error({
            detail: "Error",
            summary: error.message || "No URL found to open.",
            duration: 3000,
          });
        }
      }
    }
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
  getPerformanceDetailedList() {
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
          this.detailedList = response?.data?.agentProposalsDetailedViewLists || [];
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
    if (this.selectedTabIndex == 1) {

    }
  }
  toggleView(key: any) {
    console.log(key);
    this.docType = key;
  }


  // Personal Info code


}
