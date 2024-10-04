import { Component  } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { Subject } from "rxjs";
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from 'src/app/services/common.service';
import { RenewalsService } from '../renewals.service';

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
  productsList: any[] = [];
  policyTypes: any[] = [];
  startDate: any;
  endDate: any;
  appliedFiltersCount: number = 0;
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  selected: string = "";
  searchInputControl = new FormControl("",Validators.required);
  isDesktopView:boolean=false
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  agentCode=localStorage.getItem('agentCode');
  filterType: string = "totalRecords";

  constructor(
    private renewalService: RenewalsService,
    private router: Router,
    private datePipe: DatePipe,
    private commonService:CommonService,
  ) {}

  renewalLisRequestBody={
    "agentCode": this.agentCode,
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
    this.getRenewalsList();
    this.getProducts();
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getRenewalsList();
  }
  getRenewalsList() {
    this.renewalLisRequestBody.pageNumber = this.page;
    this.renewalLisRequestBody.pageSize = this.rows;
    this.renewalService.getRenewalListApi(this.renewalLisRequestBody).subscribe(
      (response:any) => { 
        console.log(response.data);
        if (response.success) {
          this.renewalsList = response.data.renewalsList.map((item: any) => ({
            ...item,policyEndDate: this.formatRenewedDate(item.policyEndDate)
          })); 
          console.log("Renewal List",this.renewalsList);
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType];         } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }

  formatRenewedDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "yyyy-MM-dd") || "";
  }
  filterQuotes(filter: string,filterRange: string) {
    this.renewalLisRequestBody.filterType = filter;
    this.getRenewalsList();
    this.activeFilter = filter;
    this.filterType = filterRange;
  }
  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }
  getProducts() {
    const reqData={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
        console.log("product list",this.productsList)
        const uniquePolicyTypes = Array.from(new Set(this.productsList
         .map((product) => product.familyPlan)))
         .map((policyType) => ({ name: policyType, selected: false }));
         this.policyTypes = uniquePolicyTypes;
      },
      error: (err) => {
         console.log("error coming form getproduct list API");
      }
    })
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
    } 
    else if (this.searchInputControl.hasError("pattern")) {
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
        this.renewalLisRequestBody.proposer = "";
        this.renewalLisRequestBody.policyNumber = "";
      } else if (this.selected === "proposerName") {
        this.renewalLisRequestBody.proposer = this.searchInputControl.value!;
        this.renewalLisRequestBody.mobileNumber = "";
        this.renewalLisRequestBody.policyNumber = "";
      } else if (this.selected === "policyNumber") {
        this.renewalLisRequestBody.policyNumber = this.searchInputControl.value!;
        this.renewalLisRequestBody.mobileNumber = "";
        this.renewalLisRequestBody.proposer = "";
      }
      this.getRenewalsList();
      menuTrigger.closeMenu();
    }
  }
  renewalListView(view: string) {
    this.selectedView = view;
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
    console.log("proposer PolicyNumber",proposerDetail.policyNumber);
    this.renewalService.setPolicyNo(proposerDetail.policyNumber);
    this.router.navigate(["renewals/renewalDynamicForm"]);
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
