import { Component,ElementRef,HostListener,OnInit,ViewEncapsulation  } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalServiceService } from "src/app/services/renewal/renewal-service.service";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { AdminService } from "src/app/services/admin.service";
import { Subject } from "rxjs";
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: ['./renewal-list.component.scss']
})
export class RenewalListComponent {
  renewalsList: RenewalList[] = [];
  countsList: any = [];
  renewedDate: any;
  activeFilter: string = "all";
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  selectedView: string = "list";
  selectedQuotesView: string = "quotesGrid";
  showEllipsisDropdown: number | null = null;
  productsList: any[] = [];
  policyTypes: any[] = [];
  startDate: any;
  endDate: any;
  appliedFiltersCount: number = 0;
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  showSubQuotes: boolean = false;
  showComparison: boolean = false;
  selected: string = "";
  searchInputControl = new FormControl("",Validators.required);
  isDesktopView:boolean=false

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private renewalService: RenewalServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private adminService:AdminService,
    private eRef: ElementRef,
    private spinner: NgxSpinnerService
  ) {}

  renewalLisRequestBody={
    "agentCode": "",
    "proposer": "",
    "productName": "",
    "policyNumber": "",
    "policyType": "",
    "startDate": null as string | null,
    "endDate": null as string | null,
    "pageNumber": this.page,
    "pageSize": this.rows,
    "mobileNumber": "",
    "filterType": ""
  }

  ngOnInit(): void {
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.renewalLisRequestBody.agentCode = storedAgentCode;
      this.getRenewalsList();
    }
    else{
      console.log("agent code is not present in local storege");
    }
    this.getProducts();
    this.route.queryParams.subscribe((params) => {
      this.showSubQuotes = params["showSubQuotes"] === "true";
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getRenewalsList();
  }


  getRenewalsList() {
    // this.spinner.show();
    this.renewalLisRequestBody.pageNumber = this.page;
    this.renewalLisRequestBody.pageSize = this.rows;
    // this.spinner.show();
    this.renewalService.getRenewalListApi(this.renewalLisRequestBody).subscribe(
      (response) => { 
        console.log(response.data);
        if (response.success) {
          this.renewalsList = response.data.renewalsList.map((item: any) => ({
            ...item,policyEndDate: this.formatRenewedDate(item.policyEndDate)
          })); console.log(this.renewalsList);
          this.countsList = response.data;
          this.totalRecords = this.countsList.totalRecords;
        } else {console.error("API request was not successful.");}
        // this.spinner.hide();
        // this.spinner.hide();
      },
      (error) => {
        // this.spinner.hide();
        // this.spinner.hide();
        console.error("Error from API:", error);
      }
    );
  }

  formatRenewedDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "yyyy-MM-dd") || "";
  }

  filterQuotes(filter: string) {
    this.renewalLisRequestBody.filterType = filter;
    this.getRenewalsList();
    this.activeFilter = filter;
  }

  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }
  
  getProducts() {
    this.adminService.getAllProductsList().subscribe({
      next: (res) => {
        this.productsList = res;        
        const uniquePolicyTypes = Array.from(new Set(this.productsList
        .map((product) => product.familyPlan)))
        .map((policyType) => ({ name: policyType, selected: false }));
        this.policyTypes = uniquePolicyTypes;
      },
      error: (err) => {
        console.log("error", err);
      },
    });
  }

  toggleFilterDropdown() {
    if(this.toggeleSearchdropdown==true)
    {
       this.toggeleSearchdropdown=false;
    }
    this.toggeledropdown = !this.toggeledropdown;    
  }

  calculateAppliedFiltersCount() {
    const selectedProductsCount = this.productsList.filter(
      (product) => product.selected).length;
    const selectedPolicyTypesCount = this.policyTypes.filter(
      (policyType) => policyType.selected).length;
    let count = selectedProductsCount + selectedPolicyTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count;
     this.appliedFiltersCount;
  }

  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
    console.log("startDate",this.startDate,"endDate",this.endDate);  
    this.renewalLisRequestBody.startDate=this.startDate;
    console.log("start date taken by request body",this.renewalLisRequestBody.startDate);
    this.renewalLisRequestBody.endDate=this.endDate;
    console.log("end date taken by request body",this.renewalLisRequestBody.endDate);
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
      console.log("selectedProducts",selectedProducts);     
    this.renewalLisRequestBody.productName = selectedProducts.join(", ");
     console.log("product names which are taking by request body",this.renewalLisRequestBody.productName);  
    const selectedPolicyTypes = this.policyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
      console.log("selecteed policy types",selectedPolicyTypes);  
    this.renewalLisRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body",this.renewalLisRequestBody.policyType); 
    this.getRenewalsList();
    this.toggeledropdown=false;
  }

  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.renewalLisRequestBody.productName = "";
    this.renewalLisRequestBody.policyType = "";
    this.renewalLisRequestBody.startDate = null;
    this.renewalLisRequestBody.endDate = null;
    this.toggeledropdown = false;
    this.getRenewalsList();
  }

  clear(){
    this.productsList.forEach((product) => (product.selected = false));
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.renewalLisRequestBody.productName = "";
    this.renewalLisRequestBody.policyType = "";
    this.renewalLisRequestBody.startDate = null;
    this.renewalLisRequestBody.endDate = null;
    this.getRenewalsList();
  }

  toggleSearchDropdown() {
    if(this.toggeledropdown==true)
    {
      this.toggeledropdown=false;
    }
    this.toggeleSearchdropdown = !this.toggeleSearchdropdown;
  }
  
  onSelectChanges(event: any): void {
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();
  
    if (this.selected === "mobileNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[6-9][0-9]{9}$")
      ]);
    } else if (this.selected === "proposerName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$")
      ]);
    } else if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([Validators.required]);
    }
  
    this.searchInputControl.updateValueAndValidity();
  }
  
  getErrorMessage(): string {
    if (this.searchInputControl.hasError("required")) {
      return "This field is required";
    } else if (this.searchInputControl.hasError("pattern")) {
      if (this.selected === "mobileNumber") {
        return "Invalid Mobile Number";
      } else if (this.selected === "proposerName") {
        return "Invalid Proposer Name";
      }
    }
    return "";
  }
  
  cancelSearch(menuTrigger: MatMenuTrigger) {
    this.toggeleSearchdropdown = false;
    this.selected = "";
    this.renewalLisRequestBody.mobileNumber = "";
    this.renewalLisRequestBody.proposer = "";
    this.renewalLisRequestBody.policyNumber = "";
    this.searchInputControl.reset();
    this.getRenewalsList();
    menuTrigger.closeMenu();
  }
  
  applySearch(menuTrigger: MatMenuTrigger) {
    if (this.searchInputControl.valid) {
      if (this.selected === "mobileNumber") {
        this.renewalLisRequestBody.mobileNumber = this.searchInputControl.value!;
      } else if (this.selected === "proposerName") {
        this.renewalLisRequestBody.proposer = this.searchInputControl.value!;
      } else if (this.selected === "policyNumber") {
        this.renewalLisRequestBody.policyNumber = this.searchInputControl.value!;
      }
      this.getRenewalsList();
      menuTrigger.closeMenu();
    }
  }
  
  quotesViews(view: string) {
    this.selectedView = view;
  }

  subQuotesViews(view: string) {
    this.selectedQuotesView = view;
  }

  handleAction(item: RenewalList, event: string) {
    switch (event) {
      case 'download':
        break;
      case 'delete':
        break;
      case 'email':
        break;
      case 'copyPayLink':
        const copyPayLinkRequestBody = {
          policy: item.policyNumber,  
          mobile: item.proposerMobileNumber,  
          source: ""  
        };
  
        this.renewalService.generatepaymentlink (copyPayLinkRequestBody).subscribe(
          (response:any) => {
            if (response.success) {
              console.log('Payment link copied successfully.');
            } else {
              console.error('Failed to copy payment link.');
            }
          },
          (error:any) => {
            console.error('Error while copying payment link:', error);
          }
        );
        console.log("copyPayLink");
        break;  
      case 'sms':
        const smsRequestBody = {
          agentCode: "5100003",
          type: item.policyType,
          customerName: "",  
          customerMobileNo: item.proposerMobileNumber,  
          agentMobileNo: "",  
          masterPolicyNo: "",  
          eventName: "",  
          renewalLink: "",  
          dueDate: "",  
          dateOfRenewal: item.policyEndDate,  
          renewedPolicyNo: item.policyNumber,  
          proposalNumber: "",  
          policyNumber: item.policyNumber,  
          grossRenewalAmount: item.renewalPremiumAmount.toString(),  
          isAutoSMS: true,
          sessionId: ""  
        };
  
        this.renewalService.sendrenewalsms(smsRequestBody).subscribe(
          (response:any) => {
            if (response.success) {
              console.log('WhatsApp message sent successfully.');
            } else {
              console.error('Failed to send WhatsApp message.');
            }
          },
          (error:any) => {
            console.error('Error while sending WhatsApp message:', error);
          }
        );
        console.log("sms");
        
        break;
      case 'whatsapp':
        const whatsApprequestBody = {
          templateCode: "DUE-CSTMR",
          policyNumbers: [item.policyNumber]
        };
        this.renewalService.sendrenewalwhatappsms(whatsApprequestBody).subscribe(
          (response:any) => {
            if (response.success) {
              console.log('WhatsApp message sent successfully.');
            } else {
              console.error('Failed to send WhatsApp message.');
            }
          },
          (error:any) => {
            console.error('Error while sending WhatsApp message:', error);
          }
        );
        console.log("whatsApp");
        
        break;
      case 'notice':
        break;
      case 'autodebit':
        break;  
      default:
        console.warn('Unknown action:', event);
    }
  }
  
  renewalJourney(proposerDetail : RenewalList) {
    console.log("proposerDetail",proposerDetail.policyNumber);
    this.renewalService.getPolicyNo(proposerDetail.policyNumber);
    this.router.navigate(["/portal/agent/renewalDynamicForm"]);
  }

  compareSelectedQuotes() {
    this.showSubQuotes = false;
    this.showComparison = true;
  }

  getFixedStarArray(): number[] {
    return Array.from({ length: 5 }, (_, i) => i); 
  }

  getStarClasses(index: number, rating: number): string[] {
    const starClasses = ['star'];
    const fullStars = Math.floor(rating);
    const fractionalPart = rating % 1;
    const colorClass = this.getColorClass(rating);
    starClasses.push(colorClass); 
    if (index < fullStars) {
      starClasses.push('full');
    } else if (index === fullStars && fractionalPart > 0) {
      starClasses.push('half');
    } else {
      starClasses.push('empty');
    }
    return starClasses;
  }

  getColorClass(rating: number): string {
    if (rating <= 1.5) {
      return 'red-color';
    } else if (rating > 1.5 && rating <= 3) {
      return 'gold-color';
    } else {
      return 'green-color';
    }
  }
  
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
