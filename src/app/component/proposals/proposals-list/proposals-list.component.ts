import { Component } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { AdminService } from "src/app/services/admin.service";
import { MatMenuTrigger } from '@angular/material/menu';
import { ProposalService } from 'src/app/services/proposal/proposal.service';
import { ProposalList } from 'src/app/interface/proposal.interface';
import { CommonService } from 'src/app/services/common.service';

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
  showEllipsisDropdown: number | null = null;
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
  filterType: string = "totalRecords";
  agentCode :any =localStorage.getItem('agentCode'); 
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'RUG', selected: false },
    { name: 'Family Floater', selected: false },
    { name: 'Groups', selected: false }
  ];

  constructor(
    private proposalService: ProposalService,
    private datePipe: DatePipe,
    private adminService:AdminService,
    private commonService:CommonService,
  ) {}

  proposalListRequestBody={
     "proposer": "",
     "productVarientName": "",  
     "policyNumber": "",  
     "proposalNumber": "", 
     "intermediaryID": "5100003", 
     "policyType": "",  
     "startDate": null as string | null,
     "endDate": null as string | null, 
     "pageNumber": this.page,
     "pageSize": this.rows, 
     "mobileNumber": "",  
     "filterType": "",  
     "email": "",  
     "leadId": ""
  }

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
        console.log(response.data);
        if (response.success) {
          this.proposalList = response.data.proposalList.map((item: any) => ({
            ...item
          })); 
          console.log("proposal List",this.proposalList);
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType]; 
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getProposalList API:", error);
      }
    );
  }
  filterQuotes(filter: string,filterRange: string) {
    this.proposalListRequestBody.filterType = filter;
    this.getProposalList();
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
      console.log("selecteed policy types",selectedPolicyTypes);  
    this.proposalListRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body",this.proposalListRequestBody.policyType); 
    this.getProposalList();
    this.toggeledropdown=false;
  }
  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
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
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.proposalListRequestBody.productVarientName = "";
    this.proposalListRequestBody.policyType = "";
    this.proposalListRequestBody.startDate = null;
    this.proposalListRequestBody.endDate = null;
    this.getProposalList();
  }
  toggleSearchDropdown() {
    if(this.toggeledropdown==true)   {
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
    }else if (this.selected === "proposalNumber") {
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
    this.proposalListRequestBody.mobileNumber = "";
    this.proposalListRequestBody.proposer = "";
    this.proposalListRequestBody.policyNumber = "";
    this.proposalListRequestBody.proposalNumber ="",
    this.searchInputControl.reset();
    this.getProposalList();
    menuTrigger.closeMenu();
  }
  applySearch(menuTrigger: MatMenuTrigger) {
    if (this.searchInputControl.valid) {
      if (this.selected === "mobileNumber") {
        this.proposalListRequestBody.mobileNumber = this.searchInputControl.value!;
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.policyNumber = "";
        this.proposalListRequestBody.proposalNumber =""
      } else if (this.selected === "proposerName") {
        this.proposalListRequestBody.proposer = this.searchInputControl.value!;
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.policyNumber = "";
        this.proposalListRequestBody.proposalNumber =""
      } else if (this.selected === "policyNumber") {
        this.proposalListRequestBody.policyNumber = this.searchInputControl.value!;
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.proposalNumber =""
      }else if (this.selected === "proposalNumber") {
        this.proposalListRequestBody.proposalNumber = this.searchInputControl.value!;
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.policyNumber = "";
      }
      this.getProposalList();
      menuTrigger.closeMenu();
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
}
