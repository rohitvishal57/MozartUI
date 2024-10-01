import { Component} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { AdminService } from "src/app/services/admin.service";
import { MatMenuTrigger } from '@angular/material/menu';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { CustomerList } from 'src/app/interface/customer.interface';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent {
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
  searchInputControl = new FormControl("",Validators.required);
  isDesktopView:boolean=false
  filterType: string = "totalRecords";
  agentCode :any =localStorage.getItem('agentCode'); 
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'RuG', selected: false },
    { name: 'Family Floater', selected: false },
    { name: 'Groups', selected: false }
  ];
  
  constructor(
    private customerService: CustomerService ,
    private datePipe: DatePipe,
    private adminService:AdminService,
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
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
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
    this.policyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.customerListRequestBody.productName = "";
    this.customerListRequestBody.policyType = "";
    this.customerListRequestBody.startDate = null;
    this.customerListRequestBody.endDate = null;
    this.getCustomerList();
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
    } 
    else if (this.selected === "policyNumber") {
      this.searchInputControl.setValidators([Validators.required]);
    }
    else if (this.selected === "proposalNumber") {
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
    this.customerListRequestBody.mobileNumber = "";
    this.customerListRequestBody.name = "";
    this.customerListRequestBody.policyNumber = "";
    this.customerListRequestBody.proposalNumber ="",
    this.searchInputControl.reset();
    this.getCustomerList();
    menuTrigger.closeMenu();
  }
  
  applySearch(menuTrigger: MatMenuTrigger) {
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
      menuTrigger.closeMenu();
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
