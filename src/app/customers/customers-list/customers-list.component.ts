import { Component, HostListener, Type} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CustomerList } from 'src/app/interface/customers.interface';
import { CustomersService } from '../customers.service';
import { CommonService } from 'src/app/services/common.service';
import { NgToastService } from 'ng-angular-popup';
import { searchValidationConfig }  from 'src/app/interface/common-validation.interface';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { ActivatedRoute } from '@angular/router';

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
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  currentDate = new Date().toISOString().split('T')[0];
  moreInfoIndex: number | null = null;
  activePolicy?: number= 1;
  filteredPolicyDetails = [];
  customerInfo:boolean =false;
  BasicDetailsInfo:any;
  selectedFilter: string = 'basicDetails';
  documents:any[]=[];
  selectedDocument: any = null;
  insuredMemberDetails: any[] = [];
  policyNumber: string | null = null;
  customerID: string | null = null;
  customerBasicDetails: any;

  constructor(
    private customerService: CustomersService ,private datePipe: DatePipe,
    private commonService:CommonService,private toast: NgToastService,
    private languageService: LanguageService,
    private yatraService:YatraService,
    private translateService: TranslateService, private activatedRoute: ActivatedRoute
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
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.activatedRoute.queryParams.subscribe((params : any) => {
      let routeStatus  = params['status'];
    });
    this.getCustomerList();
    this.getProducts();

    this.checkView(); //Screen View check
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getCustomerList();
    this.moreInfoIndex=null
  }

  getCustomerList() {
    this.customerListRequestBody.pageNumber = this.page;
    this.customerListRequestBody.pageSize = this.rows;
    this.customerService.getCustomerListApi(this.customerListRequestBody).subscribe(
      (response) => { 
        if (response.isSuccess) {
          this.customerList = response.data.customerList
          this.customerList = this.customerList.map(customer => ({...customer,activePolicy: 1}));
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
  restrictInput(event: KeyboardEvent): void {
    if (this.selected === 'mobileNumber' && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
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

activePolicys(active: number, index: number) {
  this.customerList[index].activePolicy = active;
}
getFilteredPolicies(policyDetails: any[], activePolicy: number,index:number) {
  if (activePolicy === 1) {
      return policyDetails.slice(0, 1);  
  } else if (activePolicy === 2) {
      return policyDetails.slice(1, 2);
  } else if (activePolicy === 3){
      this.customerListView('list');
      this.toggleMoreInfo(index);
  }
  return null;
}
customerListView(view: string) {
  if (this.selectedView !== view) {
    this.selectedView = view;
    this.resetActivePolicy();
  }
}
resetActivePolicy() {
  this.customerList.forEach(row => row.activePolicy = 1);
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
          this.toast.success({ detail: "", summary: response.data.message, duration: 2000 });
        } else {
          this.toast.error({ detail: "", summary: response.data.message || "Failed to send customer data.", duration: 2000 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "", summary: "Error while sending customer data.", duration: 2000 });
      }
    );
  }
  searchDocument(item: any, policy: any) {
    const searchDocumentRequestBody = {
      referenceId: this.agentCode,
      searchRequest: [
        {
          categoryID: "",
          description: "",
          dataClassParam: [
            {
              docSearchParamId: "2",
              value: policy.policyNumber,
            },
            {
              docSearchParamId: "15",
              value: "PS_04",
            },
          ],
        },
      ],
      agentCode: this.agentCode,
      eventName: "Search policy kit request from customers",
      sourceSystemName: "",
      searchOperator: "AND",
    };
    this.customerService.searchDocumentApi(searchDocumentRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {          
          const searchResponse = response.data.searchResponse;
          console.log("search Response",searchResponse);
          if (!searchResponse || searchResponse.length === 0) {
            this.toast.error({ detail: "", summary: response.message || "No document found.", duration: 3000 });
          }
          else{
            this.documents = searchResponse;
          }
        } else {
          this.toast.error({ detail: "", summary: response.message || "Failed to search document.", duration: 2000 });
        }
      },
      (error: any) => {
        console.error("Search document error", error);
        this.toast.error({ detail: "", summary: "Error while searching the document.", duration: 2000 });
      }
    );
  }
  downloadPolicyKit() {
    if (!this.selectedDocument) {
      this.toast.error({ detail: "", summary: "Please select a document to download.", duration: 3000 });
      return;
    }  
    const downloadPolicyKitRequestBody = {
      agentCode: this.agentCode,
      referenceId: this.agentCode,
      eventName: "Download policy kit request from customers",
      proposalNumber: "",
      downloadRequest: [
        {
          omniDocImageIndex: this.selectedDocument.omniDocImageIndex,
          fileName: this.selectedDocument.fileName,
        },
      ],
      sourceSystemName: "",
      identifier: "",
    };
    console.log("Download Request Body:", downloadPolicyKitRequestBody);
    this.customerService.downloadDocumentApi(downloadPolicyKitRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess && response.data?.downloadResponse?.length > 0) {
          const file = response.data.downloadResponse[0];
          if (file.byteArray && file.fileName) {
            const byteArray = new Uint8Array(
              atob(file.byteArray).split("").map((char) => char.charCodeAt(0))
            );
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = file.fileName;
            link.click();  
          }
        } else {
          this.toast.error({ detail: "", summary: response.message || "No file found to download.", duration: 3000 });
        }
      },
      (error: any) => {
        console.error("Download Policy Kit Error:", error);
        this.toast.error({ detail: "", summary: "Error while downloading Policy Kit.", duration: 3000 });
      }
    );
  }
  onDocumentSelectionChange(document: any, event: any) {
    if (event.target.checked) {
      this.selectedDocument = {
        fileName: document.fileName,
        omniDocImageIndex: document.omniDocImageIndex,
      };
    } else {
      this.selectedDocument = null;
    }
  }
  
  getCustomerInfo(policyNumber: string, customerID: string): void {
    this.policyNumber = policyNumber;
    this.customerID = customerID;
    this.customerInfo = true;
    this.fetchDetails('basicDetails')
  }
  backSubquotes(){
    this.customerInfo=false;
    this.selectedFilter='basicDetails';
  }
  getCustomrBasicDetails() {
    const customerBasicDetailsRequestBody = {
      customerID: this.customerID,
      policyNumber: this.policyNumber,
      agentCode: this.agentCode,
    };
  
    this.customerService.getCustomerBasicDetailsApi(customerBasicDetailsRequestBody).subscribe(
      (res: any) => {
        if (res.isSuccess && res.data) {
          this.customerBasicDetails = res.data; 
        } else {
          this.toast.error({ detail: "", summary: res.message || "Failed to get customer Basic Details.", duration: 2000 });
          this.customerBasicDetails = null;
        }
      },
      (err: any) => {
        console.error("API Error:", err);
        this.customerBasicDetails = null;
      }
    );
  }
  getCustomrProductDetails() {
    const customerProductDetailsRequestBody = {
      customerID: this.customerID,
      policyNumber: this.policyNumber,
      agentCode: this.agentCode,
    };  }
  getCustomerInsuredDetails() {
    const customerInsuredDetailsRequestBody = {
      customerID: this.customerID,
      policyNumber: this.policyNumber,
      agentCode: this.agentCode,
    };  }
  getCustomrClaimDetails() {
    const customerClaimDetailsRequestBody = {
      policyNumber: this.policyNumber,
      agentCode: this.agentCode,
    };
  }
  getCustomrEndorsementDetails() {
    const customerEndorsementDetailsRequestBody = {
      customerID: this.customerID,
      policyNumber: this.policyNumber,
      agentCode: this.agentCode,
    };  
  }
  fetchDetails(type: string) {
    if (!this.policyNumber) {
      this.toast.warning({ detail: "", summary: "PolicyNumber is required.", duration: 2000 });
      return;
    }
  this.selectedFilter=type
  if(type=='basicDetails'){
    this.getCustomrBasicDetails();
  }
  else if(type=='productDetails'){
    this.getCustomrProductDetails();
  }
  else if(type=='insuredDetails'){
    this.getCustomerInsuredDetails();
  }
  else if(type=='claimDetails'){
    this.getCustomrClaimDetails();
  }
  else if(type=='basicDetails'){
    this.getCustomrEndorsementDetails();
  }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkView(); //Screen View check
  }
  //Screen View check
  checkView() {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      this.selectedView = 'grid'; 
    }else {
      this.selectedView = 'list'; // Use 'grid' view for desktop
    }
  }
}
