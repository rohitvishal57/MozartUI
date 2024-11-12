import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ProposalList } from 'src/app/interface/proposals.interface';
import { ProposalsService } from '../proposals.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { searchValidationConfig }  from 'src/app/interface/common-validation.interface';

@Component({
  selector: 'app-proposals-list',
  templateUrl: './proposals-list.component.html',
  styleUrls: ['./proposals-list.component.scss']
})
export class ProposalsListComponent {
  proposalList: ProposalList[] = [];
  countsList: any = [];
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
  filterType: string = "totalRecords";
  agentCode=localStorage.getItem('agentCode');
  StaticPolicyTypes = [
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  proposalNum: any;
  formSequence: any[] = [];
  allJsonFormData: any[] = []
  formData: any = {}
  currentDate = new Date().toISOString().split('T')[0];
  proposalListRequestBody={
    "proposer": "",
    "productVarientName": "",  
    "proposalNumber": "", 
    "agentCode": this.agentCode, 
    "policyType": "", 
    "policyStatus": "", 
    "startDate": null as string | null,
    "endDate": null as string | null, 
    "pageNumber": this.page,
    "pageSize": this.rows, 
    "mobileNumber": "",  
    "filterType": "",  
    "email": "",  
    "leadId": ""
 } 
 
  constructor(
    private proposalService: ProposalsService,
    private datePipe: DatePipe,
    private commonService:CommonService, private router: Router,
    private toast: NgToastService,
    private encryptionService: EncryptionService
  ) {}
  
  ngOnInit(): void {
    this.getProposalList();
    this.getProducts();
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getProposalList();
  }
  getProposalList() {
    this.proposalListRequestBody.pageNumber = this.page;
    this.proposalListRequestBody.pageSize = this.rows;
    this.proposalService.getProposalListApi(this.proposalListRequestBody).subscribe(
      (response) => { 
        if (response.isSuccess) {
          this.proposalList = response.data.proposalList.map((item: any) => ({
            ...item,policyStartDate: this.formatStartDate(item.policyStartDate)
          })); 
          console.log("proposal List",this.proposalList);
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType]; 
        } 
        else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to get proposals list", duration: 2000 });
      }
    );
  }
  filterQuotes(filter: string,filterRange: string) {
    this.proposalListRequestBody.filterType = filter;
    this.first = 0;this.page = 1;
    this.getProposalList();
    this.activeFilter = filter;
    this.filterType = filterRange;
  }
  formatStartDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "dd-MM-yyyy") || "";
  }
  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }
  getProducts() {
    const productsReqBody={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(productsReqBody).subscribe({
      next: (res) => {
        console.log("product list",this.productsList)
        this.productsList=res.data
      },
      error: (err) => {
        this.toast.error({ detail: "WARNING", summary: "Failed to get Product Names", duration: 2000 });
      }
    })
  }
  toggleFilterDropdown(event: Event) {
    event.stopPropagation();
    this.toggeledropdown = !this.toggeledropdown;    
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.filterWraperForm');
    const clickedButton = (event.target as HTMLElement).closest('.jsFilterBtnClick');
    if (!clickedInside && !clickedButton && this.toggeledropdown) {
      this.toggeledropdown = false;
    }
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
    this.proposalListRequestBody.startDate=this.startDate;
    console.log("start date taken by request body",this.proposalListRequestBody.startDate);
    this.proposalListRequestBody.endDate=this.endDate;
    console.log("end date taken by request body",this.proposalListRequestBody.endDate);
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
      console.log("selectedProducts",selectedProducts);     
    this.proposalListRequestBody.productVarientName = selectedProducts.join(", ");
     console.log("product names which are taking by request body",this.proposalListRequestBody.productVarientName);  
    const selectedPolicyTypes = this.StaticPolicyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
      console.log("selected policy types",selectedPolicyTypes);  
    this.proposalListRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body",this.proposalListRequestBody.policyType); 
    this.first = 0;
    this.page = 1;
    this.getProposalList();
    this.toggeledropdown=false;
  }
  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.proposalListRequestBody.productVarientName = "";
    this.proposalListRequestBody.policyType = "";
    this.proposalListRequestBody.startDate = null;
    this.proposalListRequestBody.endDate = null;
    this.toggeledropdown = false;
    this.getProposalList();
  }
  clear(){
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.proposalListRequestBody.productVarientName = "";
    this.proposalListRequestBody.policyType = "";
    this.proposalListRequestBody.startDate = null;
    this.proposalListRequestBody.endDate = null;
    this.getProposalList();
  }
  onSelectChanges(event: any): void {
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
  }
  getPlaceholder(): string {
    if (this.selected === "mobileNumber") {
      return "Enter Mobile Number";
    } else if (this.selected === "proposerName") {
      return "Enter Proposer Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } else if (this.selected === "proposalNumber") {
      return "Enter Proposal Number";
    } else if (this.selected === "leadId") {
      return "Enter Lead ID";
    }
    else {
      return "Search...";
    }
  }
  cancelSearch() {
    this.selected = "";
    this.proposalListRequestBody.mobileNumber = "";
    this.proposalListRequestBody.proposer = "";
    this.proposalListRequestBody.leadId = "";
    this.proposalListRequestBody.proposalNumber ="",
    this.searchInputControl.reset();
    this.getProposalList();
  }
  applySearch() {    
    if (this.searchInputControl.valid) {  
      const trimmedValue = this.searchInputControl.value?.trim();     
      if (this.selected === "mobileNumber") {
        this.proposalListRequestBody.mobileNumber = trimmedValue || "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber =""
      } else if (this.selected === "proposerName") {
        this.proposalListRequestBody.proposer = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber =""
      } else if (this.selected === "leadId") {
        this.proposalListRequestBody.leadId = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.proposalNumber =""
      }else if (this.selected === "proposalNumber") {                
        this.proposalListRequestBody.proposalNumber = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
      }
      this.first = 0;
      this.page = 1;
      this.getProposalList();
    }
  }
  customerListView(view: string) {
    this.selectedView = view;
  }
  handleAction(item: ProposalList, event: string) {
    switch (event) {
      case 'download':
        break;
      case 'delete':
        break;
      default:
        console.warn('Unknown action:', event);
    }
  }
  async redirect(proposalDetails: any){

    console.log(proposalDetails);
    
    try {
      const reqData = {
        partnerId : 0,
        agentCode : this.agentCode
      }
      // await this.getProposalNum();
      // const productData = {
      //   partnerId : 1,
      //   productId : 1,
      //   proposalNum: this.proposalNum

      // }
      // await this.getFormSequence(productData);
      // if (this.formSequence != null && this.formSequence.length > 0) {
      //   this.router.navigate(['yatra'], {
      //     state: { productData: productData, formSequence: this.formSequence }
      //   });
      // }
    } catch (error) {
      console.error(error);
    }
  }

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.commonService.getProposalNumber());
      this.proposalNum = res.data.proposalNumber;
    } catch (error) {
      console.error(error);
    }
  }

  async getFormSequence(item: any) {
    try {
      sessionStorage.clear();
      const reqData = {
        "partnerId": item.partnerId,
        "productId": item.productId
      }
      const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
      this.formSequence = JSON.parse(res.data.formSequence);
      if (this.formSequence != null && this.formSequence.length > 0) {
        this.formSequence.forEach(() => { this.allJsonFormData.push({}) });
        sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonFormData));
      }
      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
      localStorage.setItem("formIndex", "0");
    } catch (err) {
      this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
    }
  }
}
