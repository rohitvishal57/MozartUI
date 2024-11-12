import { Component, HostListener} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CustomerList } from 'src/app/interface/customers.interface';
import { CustomersService } from '../customers.service';
import { CommonService } from 'src/app/services/common.service';
import { NgToastService } from 'ng-angular-popup';
import { searchValidationConfig }  from 'src/app/interface/common-validation.interface';

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
  selected: string = "";
  searchInputControl = new FormControl("");
  isDesktopView:boolean=false
  customerId:any;
  agentCode :any =localStorage.getItem('agentCode'); 
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'Floater', selected: false },
  ];
  currentDate = new Date().toISOString().split('T')[0];
  moreInfoIndex: number | null = null;
  
  constructor(
    private customerService: CustomersService ,private datePipe: DatePipe,
    private commonService:CommonService,private toast: NgToastService
  ) {}

  customerListRequestBody={
    "agentCode": this.agentCode,
    "policyNumber": "",
    "policyType": "",
    "productName": "",
    "startDate": null, 
    "endDate": null, 
    "pageNumber": this.page,
    "pageSize": this.rows,
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
    this.customerService.getCustomerListApi(this.customerListRequestBody).subscribe(
      (response) => { 
        if (response.isSuccess) {
          this.customerList = response.data.customerList
          console.log("customers List",this.customerList);
          this.totalRecords = response.data.totalRecords 
          if (this.customerList.length > 0) {
          } else {
            this.customerId = null; 
          }         
        } 
        else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        this.toast.error({ detail: "", summary: "Failed to get customers list.", duration: 2000 });
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
    return this.datePipe.transform(new Date(datetime), "dd-MM-yyyy") || "";
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
        this.toast.error({ detail: "", summary: "Failed to get products list.", duration: 2000 });
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
    this.first = 0;
    this.page = 1;
    this.getCustomerList();
    this.toggeledropdown=false;
  }
  cancel() {
    this.toggeledropdown = false;
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
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
  }
  // onSelectChanges(event: any): void {
  //   this.searchInputControl.reset("");
  //   this.searchInputControl.clearValidators();
  //   if (this.selected === "mobileNumber") {
  //     this.searchInputControl.setValidators([
  //       Validators.required,
  //       Validators.pattern(/^\s*[6-9][0-9]{9}\s*$/) 
  //     ]);
  //   } else if (this.selected === "policyNumber") {
  //     this.searchInputControl.setValidators([
  //       Validators.required,
  //       Validators.pattern(/^\s*[0-9]{2}-[0-9]{2}-[0-9]{7}-[0-9]{2}\s*$/) 
  //     ]);
  //   } else if (this.selected === "emailID") {
  //     this.searchInputControl.setValidators([
  //       Validators.required,
  //       Validators.pattern(/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/) 
  //     ]);
  //   } else if (this.selected === "name") {
  //     this.searchInputControl.setValidators([
  //       Validators.required,
  //       Validators.pattern(/^\s*[a-zA-Z]{1,20}(\s+[a-zA-Z]{1,20}){0,2}\s*$/) 
  //     ]);
  //   } 
  //   this.searchInputControl.updateValueAndValidity();
  // }
  // getErrorMessage(): string {
  //   if (this.searchInputControl.dirty && this.selected === "") {
  //     return "Select an option and enter.";
  //   }
  //   if (this.searchInputControl.hasError("required")) {
  //     return "This field is required.";
  //   }
  //   if (this.searchInputControl.hasError("pattern")) {
  //     if (this.selected === "mobileNumber") {
  //       return "Enter a valid 10-digit mobile number.";
  //     }
  //     else if (this.selected === "policyNumber") {
  //       return "Enter a valid policy number.";
  //     }
  //     else if (this.selected === "name") {
  //       return "Enter a valid name.";
  //     }
  //     if (this.selected === "emailID") {
  //       return "Enter a valid email id.";
  //     }
  //   }
  //   return "";
  // }
  getPlaceholder(): string {
    if (this.selected === "name") {
      return "Enter Name";
    } else if (this.selected === "mobileNumber") {
      return "Enter Mobile Number";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } else if (this.selected === "emailID") {
      return "Enter Email ID";
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
    this.customerListRequestBody.emailID ="",
    this.searchInputControl.reset();
    this.getCustomerList();
  }
  applySearch() {    
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim(); 
      if (this.selected === "mobileNumber") {
        this.customerListRequestBody.mobileNumber = trimmedValue || "";
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.policyNumber = "";
        this.customerListRequestBody.emailID =""
      } else if (this.selected === "name") {
        this.customerListRequestBody. name = trimmedValue || "";
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.policyNumber = "";
        this.customerListRequestBody.emailID =""
      } else if (this.selected === "policyNumber") {
        this.customerListRequestBody.policyNumber = trimmedValue || "";
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.proposalNumber =""
      }else if (this.selected === "emailID") {
        this.customerListRequestBody.emailID = trimmedValue || "";
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.policyNumber = "";
      }
      this.first = 0;
      this.page = 1;
      this.getCustomerList();
    }
  }
  customerListView(view: string) {
    this.selectedView = view;
  }
  toggleMoreInfo(index: number): void {
    this.moreInfoIndex = this.moreInfoIndex === index ? null : index;
  }

  sendCustomerDetails(data:any,policy: any,event:number){        
    const RequestBody = {
      agentcode: this.agentCode, 
      requestType: event,  
      policyNumber: policy.policyNumber || "",  
      proposalNumber: policy.proposalNumber || "",
      memberId: data.customerID,
      mobileNo: data.mobileNumber,
      emailId: data.emailID
    };
    this.customerService.sendCustomerDetails(RequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.toast.success({ detail: "", summary: "customer data shared successfully.", duration: 2000 });
        } else {
          this.toast.error({ detail: "", summary: "Failed to send customer data.", duration: 2000 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "", summary: "Error while sending customer data.", duration: 2000 });
      }
    );
  }
  download(item: any, event: string) {
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
    this.customerService.downloadCustomerData(downloadRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.toast.success({ detail: "", summary: "customer data downloaded successfully.", duration: 2000 });
        } else {
          this.toast.error({ detail: "", summary: "Failed to downloaded customer data.", duration: 2000 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "", summary: "Error while downloaded customer data.", duration: 2000 });
      }
    )
  }
  
  expandedRowIndex: any | null = false;

  toggleDetails(index: any): void {
      // Toggle row details visibility
      this.expandedRowIndex = !this.expandedRowIndex
  }
}
