import { Component, HostListener} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { MatMenuTrigger } from '@angular/material/menu';
import { CustomerList } from 'src/app/interface/customers.interface';
import { CustomersService } from '../customers.service';
import { CommonService } from 'src/app/services/common.service';
import { NgToastService } from 'ng-angular-popup';
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
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  currentDate = new Date().toISOString().split('T')[0];
  
  constructor(
    private customerService: CustomersService ,
    private datePipe: DatePipe,
    private commonService:CommonService,
    private toast: NgToastService
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
    return this.datePipe.transform(new Date(datetime), "dd-MM-yyyy") || "";
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
  toggleFilterDropdown(event: Event) {
    event.stopPropagation();
    if(this.toggeleSearchdropdown==true){
       this.toggeleSearchdropdown=false;
    }
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
    this.first = 0;
    this.page = 1;
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
      if (this.selected === "mobileNumber") {
        this.customerListRequestBody.mobileNumber = this.searchInputControl.value!;
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.policyNumber = "";
        this.customerListRequestBody.emailID =""
      } else if (this.selected === "name") {
        this.customerListRequestBody. name = this.searchInputControl.value!;
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.policyNumber = "";
        this.customerListRequestBody.emailID =""
      } else if (this.selected === "policyNumber") {
        this.customerListRequestBody.policyNumber = this.searchInputControl.value!;
        this.customerListRequestBody.mobileNumber = "";
        this.customerListRequestBody.name = "";
        this.customerListRequestBody.proposalNumber =""
      }else if (this.selected === "emailID") {
        this.customerListRequestBody.emailID = this.searchInputControl.value!;
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
  sendCustomerDetails(data:any,event:number){
    const RequestBody = {
      agentcode:this.agentCode,
      requestType: event,
      policyNumber: data.policyNumber,
      proposalNumber: data.proposalNumber,
      memberId: "",
      mobileNo: data.mobileNumber,
      emailId: data.emailID
    };
    this.customerService.sendCustomerDetails(RequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.toast.success({ detail: "Success", summary: "customer data shared successfully.", duration: 1500 });
        } else {
          this.toast.error({ detail: "Error", summary: "Failed to send customer data.", duration: 1500 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "Error", summary: "Error while sending customer data.", duration: 1500 });
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
          this.toast.success({ detail: "Success", summary: "customer data downloaded successfully.", duration: 1500 });
        } else {
          this.toast.error({ detail: "Error", summary: "Failed to downloaded customer data.", duration: 1500 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "Error", summary: "Error while downloaded customer data.", duration: 1500 });
      }
    )
  }


}
