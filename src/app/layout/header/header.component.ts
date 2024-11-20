import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService
import { NotificationService } from 'src/app/notifications/notification.service';
import { error } from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit ,OnDestroy {
  currentLanguage: string = 'en';
  isSidenavOpen: boolean = false;
  isDesktopView: boolean = window.innerWidth >= 768;
  notificationCount : number = 0;
  notifications :any[]=[];
  unReadNotificaitons : any[]=[];
  showNotifications : Boolean = false;
  agentCode : any;
  marketingContent : any[] = [
    {
      "name": "Content Hub Portal",
      "redirectURL": "https://www.abhimarketingcontenthub.com/contenthub/index.php/home/api_login?code="
    },
    {
      "name": "Customer Testimonials",
      "redirectURL": "https://www.youtube.com/playlist?list=PLfHGRTdw3O3Pp0O3pJKDciMJlqHuPoS3m"
    },
    {
      "name": "Application Tracker",
      "redirectURL": "https://www.adityabirlacapital.com/healthinsurance/#!/application-tracker"
    },
    {
      "name": "KMS",
      "redirectURL": "https://abclearning.adityabirlacapital.com/login"
    }           
];
downloadBrowcher : any[] =[
	
	{
		"name": "Activ Health Platinum Essential",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/active-health-essential-insurance"
	},
	{
		"name": "Aditya Birla Activ Assure Diamond Plan",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/activ-assure-diamond"
	},

	{
		"name": "Global Health Secure",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/corporate-health-insurance"
	},
	{
		"name": "Group Health Insurance",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/corporate-health-insurance"
	},
	{
		"name": "Health Insurance Plans",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/health-insurance-plans"
	},
	{
		"name": "Health Insurance for Diabetes",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/diabetes"
	},
	{
		"name": "Health Insurance for High BP",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/high-blood-pressure"
	},
	{
		"name": "Health Insurance for High Cholesterol",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/high-cholesterol"
	},
	{
		"name": "Health Insurance for Asthma",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/health-insurance-asthma"
	},
	{
		"name": "Individual Health Insurance",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/individual-health-insurance"
	},
	{
		"name": "Health insurance claim",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/reimbursement-claims"
	},
	{
		"name": "Employer health insurance",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/corporate-health-insurance"
	},
	{
		"name": "Health care for young adults",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/activ-fit"
	},
	{
		"name": "Super topup health insurance",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/activ-assure-diamond-super-health-topup"
	},
	{
		"name": "Health Insurance For Family",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/family-health-insurance"
	},
	{
		"name": "Hospital cash insurance",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/hospital-cash"
	},
	{
		"name": "Health insurance with OPD cover",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/cashless-opd"
	},
	{
		"name": "Ayush treatment",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/ayush-treatment"
	},
	{
		"name": "Corona virus health insurance",
		"redirectURL": "https://www.adityabirlacapital.com/healthinsurance/coronavirus-covid19"
	}
]
  
  @Input() isLoggedIn: any;

  constructor(private router: Router,
    private loginService: CommonService, private toast: NgToastService, private el: ElementRef, private languageService:LanguageService, private translateService: TranslateService,private notificationService : NotificationService
  ) {
      this.languageService.language$.subscribe(language => {
        this.currentLanguage = language;
      });
  }

  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    
    this.currentLanguage = this.getLanguage();
    this.agentCode = localStorage.getItem('agentCode') 
    this.notificationInfo();

  }

  
  ngOnDestroy() {
    //this.openNotifications();
    this.showNotifications = false;
  }

  logOut() {
    this.toast.success({ detail: "SUCCESS", summary: "Agent Logout successfully!!", duration: 2000 });
    this.loginService.signOut();
    this.router.navigate(['']);
  }

  // setLanguage(event: any) {
  //   console.log(event);
  //   let language = event.target.value;
  //   localStorage.setItem('preferredLanguage', language);
  //   this.currentLanguage = language;
  // }

  setLanguage(event: any) {
    const selectedLanguage = event.target.value;
    this.languageService.setLanguage(selectedLanguage); // Update language through the service
  }

  getLanguage(): string {
    // localStorage.setItem('preferredLanguage',  navigator.language.split('-')[0] || 'en');
    // return localStorage.getItem('preferredLanguage') ||'';
    const preferredLanguage = localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0] || 'en';
    localStorage.setItem('preferredLanguage', preferredLanguage);
    return preferredLanguage;
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    console.log('a', this.isSidenavOpen, this.isDesktopView);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth >= 768;
    if (this.isDesktopView) {
      this.isSidenavOpen = false;
    }
  }
  redirect(value: any) {
    this.router.navigate([value]);
  }

  openNotifications(){
    this.showNotifications = this.showNotifications == false? true :false;
  }

  closePopup(): void {
    this.showNotifications = false;
  }

  onPopupClick(event: MouseEvent): void {
    event.stopPropagation();  // Prevent the click from bubbling up to the overlay
  }

  // This will detect clicks outside the popup
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

 showAllNotifications(){
  this.closePopup();
  this.router.navigate(['/notifications'], {
    queryParams: { agentCode:  this.agentCode },
  });
 }

 notificationInfo() {
  this.notificationService.fetchNotificationInfo(this.agentCode).subscribe(
    (response) => {
      if (response?.isSuccess) {
        this.notifications = response?.data;
        this.unReadNotificaitons =  this.notifications.filter(notification => notification?.isRead === false);
        this.notificationCount = this.unReadNotificaitons.length;
        console.log('notifications',this.notifications)

      }
    },
    error => {
      console.log('Failed to fetch notifications',error)
    });
}

  markAllReadNotification() {
    this.notificationService.markAllNotification(this.agentCode).subscribe(
      (response) => {
        if (response?.isSuccess) {
          this.toast.success({ detail: "", summary: 'Successfully marked all notifications as read.', duration: 5000 });
          this.notificationInfo();
          this.showNotifications = false;
        }
      },
      error => {
        console.log('Failed to Mark notifications', error)
      });
  }

  routeNotification(notification: any) {
  this.notificationService.markNotification(notification.id).subscribe(
    (response)=>{
      if (response?.isSuccess) {
      //  this.closePopup();
        this.router.navigate([notification.redirectionURL]);
        this.notificationInfo();
      }
    },
    error =>{
      console.log('Failed to Mark notifications', error)
    });
  }

  routeMarketingContent(event : any){
    window.open(event.target.value);    
  }

  downloadPdfBrowcher(event : any){

  }

}
