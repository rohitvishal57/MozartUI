import { Component} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { MatMenuTrigger } from '@angular/material/menu';
import { CustomerList } from 'src/app/interface/customers.interface';
import { CustomersService } from '../customers.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent {
  customerList: CustomerList[] = [];
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
  searchInputControl = new FormControl("");
  isDesktopView:boolean=false
  filterType: string = "totalRecords";
  placeholder:string='';
  agentCode :any =localStorage.getItem('agentCode'); 
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  
  constructor(
    private customerService: CustomersService ,
    private datePipe: DatePipe,
    private commonService:CommonService,
  ) {}

  customerListRequestBody={
    "agentCode": this.agentCode,
    "policyNumber": "",
    "policyType": "",
    "productName": "",
    "startDate": null, 
    "endDate": null, 
    "pageNumber": 1,
    "pageSize": 10,
    "receiptNo": "",
    "name": "",
    "emailID": "",
    "mobileNumber": "",
    "proposalNumber": "",
    "pincode": "",
    "filterType": ""
  }
  ngOnInit(): void {
    this.getCustomerList();
    this.getProducts();
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getCustomerList();
  }
  getCustomerList() {
    this.customerListRequestBody.pageNumber = this.page;
    this.customerListRequestBody.pageSize = this.rows;
    console.log(this.customerListRequestBody);
    this.customerService.getCustomerDetailsListApi(this.customerListRequestBody).subscribe(
      (response) => { 
        console.log(response.data);
        if (response.success) {
          this.customerList = response.data.customerList.map((item: any) => ({
            ...item,policyStartDate:this.formatPolicyStartDate(item.policyStartDate)
          })); 
          console.log("proposal List",this.customerList);
          this.totalRecords = response.data.totalRecords
          console.log(this.totalRecords);
          
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getcustomerList API:", error);
      }
    );
  }
  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }
  formatPolicyStartDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "yyyy-MM-dd") || "";
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
    if(this.toggeleSearchdropdown==true){
       this.toggeleSearchdropdown=false;
    }
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
     this.appliedFiltersCount;
  }
  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
    console.log("startDate",this.startDate,"endDate",this.endDate);  
    this.customerListRequestBody.startDate=this.startDate;
    console.log("start date taken by request body",this.customerListRequestBody.startDate);
    this.customerListRequestBody.endDate=this.endDate;
    console.log("end date taken by request body",this.customerListRequestBody.endDate);
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
      console.log("selectedProducts",selectedProducts);  
       this.customerListRequestBody.productName = selectedProducts.join(", ");  
    console.log("product names which are taking by request body",this.customerListRequestBody.productName);  
    const selectedPolicyTypes = this.StaticPolicyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
      console.log("selecteed policy types",selectedPolicyTypes);  
    this.customerListRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body",this.customerListRequestBody.policyType); 
    this.getCustomerList();
    this.toggeledropdown=false;
  }
  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.customerListRequestBody.productName = "";
    this.customerListRequestBody.policyType = "";
    this.customerListRequestBody.startDate = null;
    this.customerListRequestBody.endDate = null;
    this.toggeledropdown = false;
    this.getCustomerList();
  }
  clear(){
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.customerListRequestBody.productName = "";
    this.customerListRequestBody.policyType = "";
    this.customerListRequestBody.startDate = null;
    this.customerListRequestBody.endDate = null;
    this.getCustomerList();
  }
  onSelectChanges(event: any): void {
    this.searchInputControl.setValue("");
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
    }
    else {
      return "Search...";
    }
  }
  cancelSearch() {
    this.selected = "";
    this.customerListRequestBody.mobileNumber = "";
    this.customerListRequestBody.name = "";
    this.customerListRequestBody.policyNumber = "";
    this.customerListRequestBody.proposalNumber ="",
    this.searchInputControl.reset();
    this.getCustomerList();
  }
  applySearch() {    
    if (this.searchInputControl.valid) {
      if (this.selected === "mobileNumber") {
        this.customerListRequestBody.mobileNumber = this.searchInputControl.value!;
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.policyNumber = "";
        this.customerListRequestBody.proposalNumber =""
      } else if (this.selected === "proposerName") {
        this.customerListRequestBody. name = this.searchInputControl.value!;
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.policyNumber = "";
        this.customerListRequestBody.proposalNumber =""
      } else if (this.selected === "policyNumber") {
        this.customerListRequestBody.policyNumber = this.searchInputControl.value!;
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.proposalNumber =""
      }else if (this.selected === "proposalNumber") {
        this.customerListRequestBody.proposalNumber = this.searchInputControl.value!;
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.policyNumber = "";
      }
      this.getCustomerList();
    }
  }
  customerListView(view: string) {
    this.selectedView = view;
  }
  handleAction(item: any, event: string) {
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
