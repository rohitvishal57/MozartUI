import { Component, HostListener  } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { Subject } from "rxjs";
import { CommonService } from 'src/app/services/common.service';
import { RenewalsService } from '../renewals.service';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';

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
  selected: string = "";
  searchInputControl = new FormControl("");
  isDesktopView:boolean=false
  agentCode=localStorage.getItem('agentCode');
  filterType: string = "totalRecords";
  activeSection:string= "primary"
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  currentDate = new Date().toISOString().split('T')[0];

  constructor(
    private renewalService: RenewalsService,private router: Router,private datePipe: DatePipe,
    private commonService:CommonService,private toast: NgToastService,private encryptionService: EncryptionService
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
        if (response.isSuccess) {
          this.renewalsList = response.data.renewalsList.map((item: any) => ({
            ...item,policyEndDate: this.formatRenewedDate(item.policyEndDate)
          })); 
          console.log("Renewal List",this.renewalsList);
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType];  
        }else {
          this.toast.error({ detail: "Error", summary: "Failed to get Renewals List.", duration: 2000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while generating Renewal List.", duration: 2000 });
      }
    );
  }
  formatRenewedDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "dd-MM-yyyy") || "";
  }
  filterQuotes(filter: string,filterRange: string) {
    this.renewalLisRequestBody.filterType = filter;
    this.first = 0;
    this.page = 1;
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
    const productsRequestBody={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(productsRequestBody).subscribe({
      next: (res) => {
        this.productsList = res.data;
        console.log("product list",this.productsList)
      },
      error: (err) => {
        this.toast.error({ detail: "Error", summary: "Failed to get products list", duration: 2000 });
      }
    })
  }
  toggleFilterDropdown(event: Event) {
    event.stopPropagation();
    this.toggeledropdown = !this.toggeledropdown;    
  }
  calculateAppliedFiltersCount() {
    const selectedProductsCount = this.productsList.filter(
      (product) => product.selected).length;
    const selectedPolicyTypesCount = this.StaticPolicyTypes.filter(
      (policyType) => policyType.selected).length;
    let count = selectedProductsCount + selectedPolicyTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count;
  }
  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
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
    const selectedPolicyTypes = this.StaticPolicyTypes
    .filter((policyType) => policyType.selected)
    .map((policyType) => policyType.name);
    this.renewalLisRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body",this.renewalLisRequestBody.policyType); 
    this.first = 0;
    this.page = 1;
    this.getRenewalsList();
    this.toggeledropdown=false;
  }
  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
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
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.renewalLisRequestBody.productName = "";
    this.renewalLisRequestBody.policyType = "";
    this.renewalLisRequestBody.startDate = null;
    this.renewalLisRequestBody.endDate = null;
    this.getRenewalsList();
  }
  onSelectChanges(event: any): void {
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    if (this.selected === "mobileNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern(/^\s*[6-9][0-9]{9}\s*$/) 
      ]);
    } else if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern(/^\s*[0-9]{2}-[0-9]{2}-[0-9]{7}-[0-9]{2}\s*$/) 
      ]);
    } else if (this.selected === "proposerName") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/) 
      ]);
    } 
    this.searchInputControl.updateValueAndValidity();
  }
  getErrorMessage(): string {
    if (this.searchInputControl.hasError("required")) {
      return "This field is required";
    }
    if (this.searchInputControl.hasError("pattern")) {
      if (this.selected === "mobileNumber") {
        return "Enter a valid 10-digit mobile number";
      }
      else if (this.selected === "policyNumber") {
        return "Enter a valid Policy Number";
      }
      else if (this.selected === "proposerName") {
        return "Enter a valid Proposer Name";
      }
    }
    return "";
  }
  cancelSearch() {
    this.selected = "";
    this.renewalLisRequestBody.mobileNumber = "";
    this.renewalLisRequestBody.proposer = "";
    this.renewalLisRequestBody.policyNumber = "";
    this.searchInputControl.reset();
    this.getRenewalsList();
  }
  getPlaceholder(): string {
    if (this.selected === "mobileNumber") {
      return "Enter Mobile Number";
    } else if (this.selected === "proposerName") {
      return "Enter Proposer Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    }
    else {
      return "Search...";
    }
  }
  applySearch() {
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim(); 
      if (this.selected === "mobileNumber") {
        this.renewalLisRequestBody.mobileNumber = trimmedValue || "";
        this.renewalLisRequestBody.proposer = "";
        this.renewalLisRequestBody.policyNumber = "";
      } else if (this.selected === "proposerName") {
        this.renewalLisRequestBody.proposer = trimmedValue || "";
        this.renewalLisRequestBody.mobileNumber = "";
        this.renewalLisRequestBody.policyNumber = "";
      } else if (this.selected === "policyNumber") {
        this.renewalLisRequestBody.policyNumber = this.searchInputControl.value!;
        this.renewalLisRequestBody.mobileNumber = "";
        this.renewalLisRequestBody.proposer = "";
      }
      this.first = 0;
      this.page = 1;
      this.getRenewalsList();
    }
  }
  renewalListView(view: string) {
    this.selectedView = view;
  }
  handleAction(item: RenewalList, event?: string) {
    switch (event) {
      case 'download':
        const downloadRequestBody={
          EventName:"Search policy kit request from customers",
          AgentCode:this.agentCode,
          ReferenceId:this.agentCode,
          SearchOperator:"AND",
          SearchRequest: [
            {
              CategoryID: "",
              DocumentID: "",
              ReferenceID: "",
              FileName: "",
              Description: "",
              DataClassParam: [
                {
                    DocSearchParamId: "2",
                    Value: "21-24-0002917-00"
                },
                {
                    DocSearchParamId: "15",
                    Value: "PS_04"
                }
              ]
            }
          ],
          Category: "N/A",
          UserRole: "Guest",
          SessionId: "0000",
          UserLevel: "Basic",
          BranchCode: "000",
          Designation: "N/A",
          IntCategory: "N/A",
          SourceSystemName: "Portal"
        }
        break;
      case 'payment':
        this.activeSection = event;
        this.renewalJourney(item);
        break;
      case 'email':
        const emailRequestBody = {
          agentCode: this.agentCode,
          emailId: "sona@gmail.com",
          mobile: item.proposerMobileNumber,
          eventName: "sending payment link to email",
          policyHolderFullName: item.proposerFirstName,
          renewedPolicyNumber: item.policyNumber,
          dateOfRenewed: item.policyEndDate,
          dateOfRenewal: item.policyEndDate,
          grossRenewalPayable: item.renewalPremiumAmount.toString(),
          renewalPaymentLink: "this is payment link",
          attachment: {
            flag: "string",
            details: {
              document: [
                {
                  key: "string",
                  value: "string"
                }
              ]
            }
          }
        };
        this.renewalService.sendRenewalEmailApi(emailRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "Success", summary: "Renewal notice shared successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: "Failed to send renewal notice.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending renewal notice.", duration: 1500 });
          }
        );
        break;
      case 'copyPayLink':
        const copyPayLinkRequestBody = {
          policy: item.policyNumber,
          mobile: item.proposerMobileNumber,
          source: "UnifiedPortal"
        };
        this.renewalService.generatePaymentlinkApi(copyPayLinkRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "Success", summary: "Payment link copied successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: "Failed to copy payment link.", duration: 1500});
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while copying payment link.", duration: 1500 });
          }
        );
        break;
      case 'sms':
        const smsRequestBody = {
          agentCode: this.agentCode,
          type: "DUE",
          customerName: item.proposerFirstName,
          customerMobileNo: item.proposerMobileNumber,
          agentMobileNo: "9177035634",
          eventName: "sending payment link to sms",
          dueDate: "",
          dateOfRenewal: item.policyEndDate,
          renewedPolicyNo: "",
          proposalNumber: "",
          policyNumber: item.policyNumber,
          grossRenewalAmount: item.renewalPremiumAmount.toString(),
          isAutoSMS: true,
          sessionId: ""
        };
        this.renewalService.sendRenewalsmsApi(smsRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "Success", summary: "SMS sent successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: "Failed to send SMS.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending SMS.", duration: 1500 });
          }
        );
        break;
      case 'whatsapp':
        const whatsAppRequestBody = {
          templateCode: "DUE-CSTMR",
          policyNumbers: [item.policyNumber]
        };
        this.renewalService.sendRenewalWhatsappApi(whatsAppRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "Success", summary: "WhatsApp message sent successfully.", duration: 1500});
            } else {
              this.toast.error({ detail: "Error", summary: response.message, duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending WhatsApp message.", duration: 1500 });
          }
        );
        break;
      default:
        console.warn('Unknown action:', event);
    }
  }
  renewalJourney(proposerDetail : RenewalList) {
    console.log("proposer PolicyNumber",proposerDetail.policyNumber);
    sessionStorage.setItem("policyNumberRen", this.encryptionService.encrypt(proposerDetail.policyNumber));
    sessionStorage.setItem("policyActionRen", this.encryptionService.encrypt(this.activeSection));
    this.router.navigate([`renewal/payment`]);
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.filterWraperForm');
    const clickedButton = (event.target as HTMLElement).closest('.jsFilterBtnClick');
    if (!clickedInside && !clickedButton && this.toggeledropdown) {
      this.toggeledropdown = false;
    }
  }

}