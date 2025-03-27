import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { RenewalList } from "src/app/interface/renewal-list.interface";
import { empty, firstValueFrom, Subject } from "rxjs";
import { CommonService } from 'src/app/services/common.service';
import { RenewalsService } from '../renewals.service';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { searchValidationConfig } from 'src/app/interface/common-validation.interface';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { CustomersService } from 'src/app/customers/customers.service';
import { DatepipePipe } from 'src/app/utilities/pipe/datepipe.pipe';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: ['./renewal-list.component.scss'],
  providers: [DatepipePipe]
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
  selected: string = '';
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false;
  agentCode = localStorage.getItem('agentCode');
  filterType: string = "totalRecords";
  activeSection: string = "primary"
  StaticPolicyTypes = [
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  AutoDebitStatus = [
    { name: 'Yes', selected: false, value: 'True' },
    { name: 'No', selected: false , value: 'False' }
  ];
  TenureList = [
    { name: '1 Year', selected: false, value: '1' },
    { name: '2 Year', selected: false , value: '2' },
    { name: '3 Year', selected: false , value: '3' },
  ];
  currentDate = new Date().toISOString().split('T')[0];
  proposalNum: string = '';
  documents: any[] = [];
  selectedDocument: any = null;
  searchApplied: boolean = false;
  policyNumber: any;
  paymentStatus: any = "";
  isAutoDebitModalVisible: boolean = false;
  selectedProposerDetail: any ="";
  selectedAction: string = "";
  isSearch: boolean = false;
  renewalInfoResponse: any;
  actionType: string | undefined;
  agentName: string | undefined | null;
  formSequence: any;
  isDropdownOpen: boolean = false;
  items: any;
  filterText: any;
  filteredItems:any = [];
  linkUrl: string = "https://app.powerbi.com/groups/me/reports/6e9a8f65-8065-4a7b-8463-6599e98b902b/ReportSection?experience=power-bi";
  checkBoxSelectedLeads: any = [];
  renewalType : any = "List";
  subAgentCode: string = "";
  bulkrenewalnoticelist: any;

  constructor(
    private renewalService: RenewalsService, private router: Router, private datePipe: DatePipe,private authService: AuthService,
    private commonService: CommonService, private toast: NgToastService, private encryptionService: EncryptionService, private languageService: LanguageService,
    private customerService: CustomersService, private translateService: TranslateService, private activatedRoute: ActivatedRoute, private datepipePipe: DatepipePipe
  ) { }

  renewalListRequestBody = {
    "agentCode": this.agentCode,
    "productName": "",
    "policyType": "",
    "startDate": null as string | null,
    "endDate": null as string | null,
    "pageNumber": this.page,
    "pageSize": this.rows,
    "filterType": "",
    "autoDebit": "",
    "tenure": "",
    "searchString":"",
    "searchColumn":""
  }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });
    this.agentName = localStorage.getItem("agentName");
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let routeStatus = params['status'];
      const filter = params['filter'];
      if (routeStatus) {
        if (routeStatus === 'Due Today') {
          this.filterQuotes('dueToday', 'dueTodayCount');
        } else if(routeStatus === 'End of Grace Period Today'){
          this.filterQuotes('ExpiredPolicies','expiredCount');
        } else if (routeStatus === 'Due in 30 Days') {
          this.filterQuotes('<30DaysExpired', 'expiringInLessThan30DaysCount'); 
        } else if (routeStatus === 'Due in 60 Days') {
          this.filterQuotes('30-60Days', 'expiringIn30To60DaysCount');
        }
      }
      if (filter) {
        const dateRange = this.datepipePipe.getDateRange(filter);
        this.startDate = dateRange.startDate;
        this.endDate = dateRange.endDate;
      }
      if(routeStatus || filter){
        this.applyFilter();
      }
    });
    if(this.authService.getUserInfo().teamList && this.authService.getUserInfo().teamList?.length > 0){
      this.items = this.authService.getUserInfo().teamList;
    }
    this.filteredItems = (this.items?.length > 0) ? [...this.items] : [];    
    this.getRenewalsList();
    this.getProducts();
    this.checkView();
    const stateData = history.state;
    if (stateData && Object.keys(stateData).length > 0) {
      if (stateData.paymentStatus) {
        const paymentStatus = this.encryptionService.decrypt(stateData.paymentStatus);
        if (paymentStatus == "PENDING") {
          this.toast.warning({ detail: "Warning", summary: "payment Pending", duration: 5000 });
        } else if (paymentStatus == "INPROGRESS") {
          this.toast.warning({ detail: "Warning", summary: "payment inprogress", duration: 5000 });
        }
      }
      try {
        if (stateData.policyNumber) {
          this.policyNumber = this.encryptionService.decrypt(stateData.policyNumber);
          console.log(this.policyNumber);
        }
      } catch (error) {
        console.error(error);

      }
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.isSearch = false;
    this.getRenewalsList();
  }

  getRenewalsList() {
    if(!this.isSearch){
      this.renewalListRequestBody.pageNumber = this.page;
      this.renewalListRequestBody.pageSize = this.rows;
    }else {
      this.renewalListRequestBody.pageNumber = 1;
    }
    this.renewalService.getRenewalListApi(this.renewalListRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.renewalsList = response.data.renewalsList.map((item: any) => ({
            ...item, policyEndDate: this.formatRenewedDate(item.policyEndDate), policyStartDate: this.formatRenewedDate(item.policyStartDate)
          }));
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType];
        } else {
          this.toast.error({ detail: "Error", summary: response.message || "Failed to get Renewals List.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while generating Renewal List.", duration: 3000 });
      }
    );
  }
  
  getRenewalList(type: string){
    this.renewalType = type;
    this.selected = "";
    this.renewalListRequestBody.searchColumn="";
    this.renewalListRequestBody.searchString="";
    this.searchInputControl.reset();
    this.searchApplied = false;
    this.getRenewalsList();
  }

  getBulkRenewalNotice(type: string){
    this.renewalType = type;
    this.selected = "";
    this.renewalListRequestBody.searchColumn="";
    this.renewalListRequestBody.searchString="";
    this.searchInputControl.reset();
    this.searchApplied = false;
    this.getRenewalsList();
  }
  getBulkRenewal(type: string){
    this.renewalType = type;
    this.selected = "";
    this.renewalListRequestBody.searchColumn="";
    this.renewalListRequestBody.searchString="";
    this.searchInputControl.reset();
    this.searchApplied = false;

    const bulkrenewalnoticelistRequestBody = {
      agentCode : this.agentCode,
    }
    console.log(bulkrenewalnoticelistRequestBody);
    this.renewalService.getbulkrenewalnoticelist(bulkrenewalnoticelistRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.bulkrenewalnoticelist = response.data || [];
          this.bulkrenewalnoticelist = response.data.map((item: any) => ({
            ...item, createdOn: this.formatRenewedDate(item.createdOn)
          }));
          this.totalRecords = Array.isArray(response.data) ? response.data.length : 0;
        } else {
          this.toast.error({ detail: "Error", summary: response.message || "Failed to get response from getbulkrenewalnoticelist API.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while generating bulkrenewalnoticelist.", duration: 3000 });
      }
    );
    
  }

  downloadrenewalbulknotices(BatchNumber:any){
    const downloadrenewalbulknoticesRequestBody = {
      batchNumber : BatchNumber
    }
    this.renewalService.downloadrenewalbulknotices(downloadrenewalbulknoticesRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          if(response.data){
            const blob = this.commonService.base64ToBlob(response?.data?.fileContentBase64,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            this.commonService.saveAsExcelFile(blob, response?.data?.fileName); 
          }
        } else {
          this.toast.error({ detail: "Error", summary: response.message || "Failed to get response from downloadrenewalbulknotices API.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Failed to get response from downloadrenewalbulknotices API.", duration: 3000 });
      }
    );

  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  filterItems() {
    this.filteredItems = this.items.filter((item: string) =>
      item.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  clearTeamView() {
    // const parentCode = localStorage.getItem('parentCode');
    // parentCode && localStorage.setItem("agentCode", parentCode);
    // window.location.reload();

    this.subAgentCode = "";
    this.isDropdownOpen = false;
  }

  teamViewRedirect(agentCode: string) {
    if (agentCode && this.linkUrl) {
      // localStorage.setItem("agentCode", agentCode);
      // window.open(this.linkUrl, "_blank");
      // window.location.reload();
      this.subAgentCode = agentCode;
      this.isDropdownOpen = false;
    } else {
      console.error('Agent code or link URL is missing');
    }
  }

  updateSelectedLeads(leadInfo: any) {
    console.log(leadInfo);
    if (this.checkBoxSelectedLeads.some((policyNo: any) => policyNo.policyNumber === leadInfo.policyNumber)) {
      this.checkBoxSelectedLeads = this.checkBoxSelectedLeads.filter((policyNo: any) => policyNo.policyNumber !== leadInfo.policyNumber);
    } else {
      this.checkBoxSelectedLeads.push(leadInfo);
    }
  }

  toggleAll(event: Event) {
    const input = event.target as HTMLInputElement;
    this.renewalsList.forEach(lead => lead.isSelected = input.checked)
    this.checkBoxSelectedLeads = this.renewalsList.filter(lead => lead.isSelected);
  }

  downloadResult() {
    if (this.checkBoxSelectedLeads.length <= 0) {
        this.toast.warning({ detail: "Warning", summary: "Please select at least one policy", duration: 3000 });
        return;
    } else {
      const downloadResultRequestBody = {
        agentCode : this.agentCode,
        subAgentCode : this.subAgentCode || "",
        policyNumbers: this.checkBoxSelectedLeads
        .filter((lead:any) => lead.isSelected)
        .map((lead:any) => lead.policyNumber)
      }
      console.log(downloadResultRequestBody);
      this.renewalService.savebulkrenewalnotice(downloadResultRequestBody).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            if(response.data.batchNumber){
              this.toast.success({ detail: "Success", summary: `Batch Number ${response.data.batchNumber} Generated Successfully`, duration: 4000 });
            }
            if(!response.data.batchNumber){
              this.toast.warning({ detail: "Warning", summary: "Failed to Generated BatchNumber", duration: 3000 });
            }
          } else {
            this.toast.error({ detail: "Error", summary: response.message || "Failed to get response from savebulkrenewalnotice API.", duration: 3000 });
          }
        },
        (error) => {
          this.toast.error({ detail: "Error", summary: "Error while doing savebulkrenewalnotice.", duration: 3000 });
        }
      );
      
    }
    console.log(this.checkBoxSelectedLeads);
  }

  downloadAll(){
    console.log(this.checkBoxSelectedLeads);
  }

  formatRenewedDate(datetime: string): string {
    return this.datePipe.transform(new Date(datetime), "dd-MM-yyyy") || "";
  }

  filterQuotes(filter: string, filterRange: string) {
    this.renewalListRequestBody.filterType = filter;
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
    this.renewalService.getrenewalProductslist().subscribe({
      next: (res: any) => {
        if (res?.isSuccess && Array.isArray(res.data)) {
          this.productsList = res.data.map((productName:any) => ({
            productName,
            selected: false,
          }));
        } else {
          this.toast.error({ detail: "Error", summary: "Invalid product data received.", duration: 2000 });
        }
      },
      error: () => {
        this.toast.error({ detail: "Error", summary: "Failed to get products list.", duration: 2000 });
      }
    });
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
    const selectedautoDebitTypesCount = this.AutoDebitStatus.filter(
      (policyType) => policyType.selected).length;
    const selectedtenureTypesCount = this.TenureList.filter(
      (policyType) => policyType.selected).length;
    let count = selectedProductsCount + selectedPolicyTypesCount + selectedautoDebitTypesCount + selectedtenureTypesCount;
    if (this.startDate && this.endDate) {
      count++;
    }
    // this.renewalListRequestBody.autoDebit !== '' && count++;
    // this.renewalListRequestBody.tenure !== '' && count++;
    this.appliedFiltersCount = count;
  }

  applyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
    this.renewalListRequestBody.startDate = this.startDate;
    this.renewalListRequestBody.endDate = this.endDate;
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
    this.renewalListRequestBody.productName = selectedProducts.join(",");
    const selectedPolicyTypes = this.StaticPolicyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
    this.renewalListRequestBody.policyType = selectedPolicyTypes.join(",");
    const selectedAutoDebit = this.AutoDebitStatus
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.value);
    this.renewalListRequestBody.autoDebit = selectedAutoDebit.join(",");
    const selectedTenure = this.TenureList
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.value);
    this.renewalListRequestBody.tenure = selectedTenure.join(",");
    this.first = 0;
    this.page = 1;
    this.getRenewalsList();
    this.toggeledropdown = false;
  }

  cancel() {
    this.toggeledropdown = false;
  }

  clear() {
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.TenureList.forEach((policyType) => (policyType.selected = false));
    this.AutoDebitStatus.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.renewalListRequestBody.productName = "";
    this.renewalListRequestBody.policyType = "";
    this.renewalListRequestBody.autoDebit = "";
    this.renewalListRequestBody.tenure = "";
    this.renewalListRequestBody.startDate = null;
    this.renewalListRequestBody.endDate = null;
    this.getRenewalsList();
  }

  onSelectChanges(event: any): void {
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
  }

  cancelSearch() {
    this.selected = "";
    // this.renewalListRequestBody.mobileNumber = "";
    // this.renewalListRequestBody.proposer = "";
    // this.renewalListRequestBody.policyNumber = "";
    // this.renewalListRequestBody.email = "";
    this.renewalListRequestBody.searchColumn="";
    this.renewalListRequestBody.searchString="";
    this.searchInputControl.reset();
    this.searchApplied = false;
    this.getRenewalsList();
  }

  getPlaceholder(): string {
    if (this.selected === "mobileNumber") {
      return "Enter Mobile Number";
    } else if (this.selected === "proposerName") {
      return "Enter Proposer Name";
    } else if (this.selected === "policyNumber") {
      return "Enter Policy Number";
    } else {
      return "Search...";
    }
  }

  restrictInput(event: KeyboardEvent): void {
    if (this.selected === 'mobileNumber' && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  applySearch() {
    const trimmedValue = this.searchInputControl.value?.trim();
    if (!trimmedValue) {
        // this.renewalListRequestBody.mobileNumber = "";
        // this.renewalListRequestBody.proposer = "";
        // this.renewalListRequestBody.policyNumber = "";
        // this.renewalListRequestBody.email = "";
        this.renewalListRequestBody.searchColumn="";
        this.renewalListRequestBody.searchString="";
        // this.isSearch = false;
        // this.getRenewalsList();
    }
    if (this.searchInputControl.valid && trimmedValue) {
      if (this.selected === "mobileNumber") {
        // this.renewalListRequestBody.mobileNumber = trimmedValue || "";
        // this.renewalListRequestBody.proposer = "";
        // this.renewalListRequestBody.policyNumber = "";
        // this.renewalListRequestBody.email = "";
        this.renewalListRequestBody.searchColumn="mobileNumber";
        this.renewalListRequestBody.searchString=trimmedValue || "";
      } else if (this.selected === "proposerName") {
        // this.renewalListRequestBody.proposer = trimmedValue || "";
        // this.renewalListRequestBody.mobileNumber = "";
        // this.renewalListRequestBody.policyNumber = "";
        // this.renewalListRequestBody.email = "";
        this.renewalListRequestBody.searchColumn="proposer";
        this.renewalListRequestBody.searchString=trimmedValue || "";
      } else if (this.selected === "policyNumber") {
        // this.renewalListRequestBody.policyNumber = trimmedValue || "";
        // this.renewalListRequestBody.mobileNumber = "";
        // this.renewalListRequestBody.proposer = "";
        // this.renewalListRequestBody.email = "";
        this.renewalListRequestBody.searchColumn="policyNumber";
        this.renewalListRequestBody.searchString=trimmedValue || "";
      } else if (this.selected === 'email') {
        // this.renewalListRequestBody.email = trimmedValue || "";
        // this.renewalListRequestBody.policyNumber = "";
        // this.renewalListRequestBody.mobileNumber = "";
        // this.renewalListRequestBody.proposer = "";
        this.renewalListRequestBody.searchColumn="email";
        this.renewalListRequestBody.searchString=trimmedValue || "";
      }
      this.first = 0;
      this.page = 1;
      this.searchApplied =true;
      this.getRenewalsList();
    }
  }
  triggerSearch(): void {
        // this.renewalListRequestBody.mobileNumber = "";
        // this.renewalListRequestBody.proposer = "";
        // this.renewalListRequestBody.policyNumber = "";
        // this.renewalListRequestBody.email = "";
        this.renewalListRequestBody.searchColumn="";
        this.renewalListRequestBody.searchString="";
        this.isSearch = false;
        this.searchApplied =false;
        this.getRenewalsList();
    // if (!this.selected) {
    //   return;
    // }
    // if (this.searchInputControl.valid && this.searchInputControl.value?.trim()) {
    //   if (!this.searchApplied) {
    //     this.applySearch();
    //     this.searchApplied = true;
    //   } else {
    //     this.cancelSearch();
    //     this.searchApplied = false;
    //   }
    // } else {
    //   console.log("Invalid input or empty value");
    // }
  }

  renewalListView(view: string) {
    this.selectedView = view;
  }

  downloadPolicyKit() {
    if (!this.selectedDocument) {
      this.toast.error({ detail: "Error", summary: "Please select a document to download.", duration: 3000 });
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
    this.customerService.downloadDocumentApi(downloadPolicyKitRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess && response.data?.downloadResponse?.length > 0) {
          const file = response.data.downloadResponse[0];
          if (file.byteArray && file.fileName) {
            const byteArray = new Uint8Array(
              atob(file.byteArray).split("").map((char) => char.charCodeAt(0))
            );
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = file.fileName;
            document.body.appendChild(link)
            link.click();
            document.body.removeChild(link)
            window.open(fileURL, "_blank");
          }else{
            const errorDescription =response?.data?.downloadResponse?.[0]?.error?.[0]?.description || "No file found to download.";
            this.toast.error({ detail: "Error", summary: errorDescription, duration: 3000 });
          }
        } else {
          this.toast.error({ detail: "Error", summary: response.message || "No file found to download.", duration: 3000 });
        }
      },
      (error: any) => {
        this.toast.error({ detail: "Error", summary: "Error while downloading Policy Kit.", duration: 3000 });
      }
    );
  }

  errorMessages: string = '';

  handleAction(item: RenewalList, event?: string) {
    switch (event) {
      case 'download_RN':
        const searchDocumentRequestBody = {
          referenceId: this.agentCode,
          searchRequest: [
            {
              categoryID: "",
              description: "",
              dataClassParam: [
                {
                  docSearchParamId: "2",
                  value: item.policyNumber,
                },
                {
                  DocSearchParamId: "15",
                  Value: "RN_Notice"
                }
              ],
            },
          ],
          agentCode: this.agentCode,
          eventName: "Search policy kit request from Renewals",
          sourceSystemName: "",
          searchOperator: "AND",
        };
        this.customerService.searchDocumentApi(searchDocumentRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              const searchResponse = response.data.searchResponse;
              if (searchResponse && searchResponse[0]?.error?.some((err: any) => err.description !== "SUCCESS")) {
                const errorMessages = "No documents are available to download."
                this.toast.warning({ detail: "Warning", summary: errorMessages, duration: 3000 });
                return;
              }
              else {
                this.documents = searchResponse;
                this.selectedDocument = this.documents[0]
                this.downloadPolicyKit()
              }
            } else {
              this.toast.error({ detail: "Error", summary: response.message || "Failed to search document.", duration: 2000 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while searching the document.", duration: 2000 });
          }
        );
        this.actionType = "MoreBtn-Download Renewal Notice"
        this.saveActionData(item, this.actionType);
        break;
      case 'download_PK':
        const searchPolicyKitRequest = {
          referenceId: this.agentCode,
          searchRequest: [
            {
              categoryID: "",
              description: "",
              dataClassParam: [
                {
                  docSearchParamId: "2",
                  value: item.policyNumber,
                },
                {
                  DocSearchParamId: "15",
                  Value: "PS_04"
                }
              ],
            },
          ],
          agentCode: this.agentCode,
          eventName: "Search policy kit request from Renewals",
          sourceSystemName: "",
          searchOperator: "AND",
        };
        this.customerService.searchDocumentApi(searchPolicyKitRequest).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              const searchResponse = response.data.searchResponse;
              if (searchResponse && searchResponse[0]?.error?.some((err: any) => err.description !== "SUCCESS")) {
                const errorMessages = "No documents are available to download."
                this.toast.warning({ detail: "Warning", summary: errorMessages, duration: 3000 });
                return;
              }
              else {
                this.documents = searchResponse;
                this.selectedDocument = this.documents[0]
                this.downloadPolicyKit()
              }
            } else {
              this.toast.error({ detail: "Error", summary: response.message || "Failed to search document.", duration: 2000 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while searching the document.", duration: 2000 });
          }
        );
        this.actionType = "MoreBtn-Download Policy Kit"
        this.saveActionData(item, this.actionType);
        break;
      case 'email':
        const emailRequestBody = {
          agentCode: this.agentCode,
          policyHolderFullName: item.proposerFirstName,
          renewedPolicyNumber: item.policyNumber,
          dateOfRenewed: item.policyEndDate,
          dateOfRenewal: item.policyEndDate,
          grossRenewalPayable: item.renewalPremiumAmount.toString(),
        }
        // {
        //   agentCode: this.agentCode,
        //   emailId: item.proposerEmail,
        //   mobile: item.proposerMobileNumber || "",
        //   eventName: "sending payment link to email",
        //   policyHolderFullName: item.proposerFirstName,
        //   renewedPolicyNumber: item.policyNumber,
        //   dateOfRenewed: item.policyEndDate,
        //   dateOfRenewal: item.policyEndDate,
        //   grossRenewalPayable: item.renewalPremiumAmount.toString(),
        //   renewalPaymentLink: "",
        //   attachment: {
        //     "Flag": "1",
        //     "Details": {
        //       "Document": [
        //         {
        //           "Key": "2",
        //           "Value": item.policyNumber,
        //         },
        //         {
        //           "Key": "15",
        //           "Value": "RN_Notice"
        //         }
        //       ]
        //     }
        //   }
        // };
        this.renewalService.sendRenewalEmailApi(emailRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "success", summary: response.data.message || "Renewal notice shared successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: response.data.message || "Failed to send renewal notice.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending renewal notice.", duration: 1500 });
          }
        );
        this.actionType = "MoreBtn-email"
        this.saveActionData(item, this.actionType);
        break;
      case 'copyPayLink':
        // const copyPayLinkRequestBody = {
        //   policy: item.policyNumber,
        //   mobile: item.proposerMobileNumber,
        //   source: "UnifiedPortal"
        // };
        // this.renewalService.generatePaymentlinkApi(copyPayLinkRequestBody).subscribe(
        //   (response: any) => {
        //     if (response.isSuccess) {
        //       this.toast.success({ detail: "Success", summary: "Payment link copied successfully.", duration: 1500 });
        //     } else {
        //       this.toast.error({ detail: "Error", summary: "Failed to copy payment link.", duration: 1500});
        //     }
        //   },
        //   (error: any) => {
        //     this.toast.error({ detail: "Error", summary: "Error while copying payment link.", duration: 1500 });
        //   }
        // );
        break;
      case 'sms':
        const smsRequestBody = {
          agentCode: this.agentCode,
          type: "DUE",
          customerName: item.proposerFirstName,
          customerMobileNo: item.proposerMobileNumber || "",
          agentMobileNo: "",
          eventName: "sending payment link via sms",
          dueDate: "",
          dateOfRenewal: item.policyEndDate,
          renewedPolicyNo: item.policyNumber,
          proposalNumber: "",
          policyNumber: item.policyNumber,
          grossRenewalAmount: item.renewalPremiumAmount.toString(),
          isAutoSMS: true,
          sessionId: ""
        };
        this.renewalService.sendRenewalsmsApi(smsRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "Success", summary: response.data.message || "SMS sent successfully.", duration: 3000 });
            } else {
              this.toast.error({ detail: "Error", summary: response.data.message || "Failed to send SMS.", duration: 3000 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending SMS.", duration: 3000 });
          }
        );
        this.actionType = "MoreBtn-SMS"
        this.saveActionData(item, this.actionType);
        break;
      case 'whatsapp':
        const whatsAppRequestBody = {
          templateCode: item.renewalStatus === 'LAPSED' ? "DUE-CSTMR" : "GRC-AGNT",
          policyNumbers: [item.policyNumber]
        };
        this.renewalService.sendRenewalWhatsappApi(whatsAppRequestBody).subscribe(
          (response: any) => {
            if (response.isSuccess) {
              this.toast.success({ detail: "Success", summary: response.data.message || "WhatsApp message sent successfully.", duration: 1500 });
            } else {
              this.toast.error({ detail: "Error", summary: response.data.message || "Failed to send Whasapp message.", duration: 1500 });
            }
          },
          (error: any) => {
            this.toast.error({ detail: "Error", summary: "Error while sending WhatsApp message.", duration: 1500 });
          }
        );
        this.actionType = "MoreBtn-whatsApp"
        this.saveActionData(item, this.actionType);
        break;

      case 'sharePaymentLink':
        const payload = {
          Policy_Number: item.policyNumber
      };

        this.renewalService.sendpaymentlink(payload).subscribe({
          next: (response: any) => {
            if (response.data) {
              this.toast.success({ detail: "SUCCESS", summary: response.data.message || "Link has been sent successfully", duration: 3000 });
            } else {
              this.toast.warning({ detail: "WARNING", summary: "Invalid payment link received", duration: 3000 });
            }
          },
          error: (error) => {
            this.toast.error({ detail: "ERROR", summary: "Failed to generate payment link", duration: 3000 });
          }
        });
        this.actionType = "MoreBtn-Share Payment Link"
        this.saveActionData(item, this.actionType);
       break;
      default:
        console.warn('Unknown action:', event);
    }
  }

  async renewalJourney(proposerDetail: RenewalList, action: string) {
    try {
        this.actionType = action == "withmodify" ? "Modify Button" : "Renew Button"
        this.saveActionData(proposerDetail, this.actionType);
       if (action === "withmodify") {
          const payload = {
              policyNumber: proposerDetail.policyNumber
          };

          const redirectionResponse: any = await firstValueFrom(this.renewalService.cpRedirectionApi(payload));
          const encryptedUrl = redirectionResponse.data;
          window.open(encryptedUrl, "_self");
          return;
        }

        const paymentStatusRequestBody = { policyNumber: proposerDetail.policyNumber };
        const paymentDetailResponse: any = await firstValueFrom(this.renewalService.getpaymentdetailsbypolicynoApi(paymentStatusRequestBody));

        if (paymentDetailResponse.message.toLowerCase().includes("policy renewed")) {
            this.toast.success({ detail: "Success", summary: paymentDetailResponse.message, duration: 3000 });
            return;
        }
        if (!paymentDetailResponse?.isSuccess || !paymentDetailResponse?.data || Object.keys(paymentDetailResponse.data).length === 0) {
            this.processRenewal(proposerDetail, action, false);
            return;
        }
        const paymentDetail = paymentDetailResponse.data;
        this.paymentStatus = paymentDetail?.paymentStatus.toUpperCase();
        const formData = {
            proposalNumber: paymentDetail?.fullQuoteResponse?.proposalNumber || '',
            policyNumber: paymentDetail?.fullQuoteResponse?.policyNumber || proposerDetail.policyNumber || "",
            policyStatus: paymentDetail?.policyStatus || '',
            policyStartDate: paymentDetail?.fullQuoteResponse?.policyStartDate || '',
            policyEndDate: paymentDetail?.fullQuoteResponse?.policyEndDate || '',
            receiptID: paymentDetail?.fullQuoteResponse?.receiptID || '',
            customerId: paymentDetail?.customerId || '',
            applicationNumber: paymentDetail?.applicationNumber || paymentDetail?.fullQuoteResponse?.proposalNumber || '',
            status: paymentDetail?.fullQuoteResponse?.status || '',
            productName: paymentDetail?.productName || '',
            premiumPaid: paymentDetail?.fullQuoteResponse?.premiumPaid || '',
            isFullQuoteSuccess: paymentDetail?.isFullQuoteSuccess || false,
            paymentMessage: "",
            policyNo: paymentDetail?.fullQuoteResponse?.policyNumber || "",
            paymentStatus: paymentDetail?.paymentStatus,
        };

        // Handle payment status scenarios
        if (this.paymentStatus === "SUCCESS" || this.paymentStatus.startsWith("IN")) {
            if (paymentDetail?.isFullQuoteSuccess) {
                if (paymentDetail.errorMessage) {
                    this.toast.success({ detail: "Success", summary: paymentDetail.errorMessage, duration: 5000 });
                }
                this.router.navigate(["renewal/renewalJourney"], {
                    state: {
                        formData: this.encryptionService.encrypt(formData),
                        proposalNum: this.encryptionService.encrypt(""),
                        journeyProcess: this.encryptionService.encrypt(0),
                        formIndex: "3",
                    },
                });
            } else {
                if (paymentDetail?.errorMessage) {
                    this.toast.warning({ detail: "Warning", summary: paymentDetail?.errorMessage, duration: 5000 });
                }
                formData.paymentMessage = "Payment completed successfully; policy issuance pending";
                this.router.navigate(["renewal/renewalJourney"], {
                    state: {
                        formData: this.encryptionService.encrypt(formData),
                        formIndex: "3",
                    },
                });
            }
        } else if (this.paymentStatus === "INPROGRESS" || this.paymentStatus === "PENDING") {
            formData.paymentMessage = "Payment pending; please wait for processing";
            this.toast.warning({ detail: "Warning", summary: paymentDetail.errorMessage || "Payment Pending", duration: 5000 });
            this.router.navigate(["renewal/renewalJourney"], {
                state: {
                    formData: this.encryptionService.encrypt(formData),
                    paymentStatus: this.encryptionService.encrypt(paymentDetail?.paymentStatus),
                    formIndex: "3",
                },
            });
        } else {
            this.processRenewal(proposerDetail, action, false);
        }
    } catch (err) {
        this.toast.error({ detail: "Error", summary: "Error while processing renewal journey.", duration: 3000 });
    }
}

exitAutoDebitModal() {
    this.isAutoDebitModalVisible = false;
}

continueAutoDebitModal() {
    this.isAutoDebitModalVisible = false;
    this.processRenewal(this.selectedProposerDetail, this.selectedAction, true);
}

async processRenewal(proposerDetail: RenewalList, action: string, isAutoDebitHandled: boolean) {
    try {      
        const renewalInfoRequestBody = { policy_Number: proposerDetail.policyNumber };
        if(!isAutoDebitHandled){
          this.renewalInfoResponse = await firstValueFrom(this.renewalService.getRenewalInfoApi(renewalInfoRequestBody));
      //     let memberDetails = [...this.renewalInfoResponse.data.insuredMemberDetails]; // Create a shallow copy of the array
      //     let insuredMembers = { ...this.renewalInfoResponse.data.insuredMembers }; // Copy insuredMembers
      //     let sonCount = 1;
      //     let daughterCount = 1;
      //     memberDetails = memberDetails.map(member => {
      //       if (member.relation === "Dependent Son") {
      //           const newRelation = `Son${sonCount++}`;
      //           insuredMembers[newRelation] = true; // Ensure it exists and is set to true
      //           return { ...member, relation: newRelation };
      //       } else if (member.relation === "Dependent Daughter") {
      //           const newRelation = `Daughter${daughterCount++}`;
      //           insuredMembers[newRelation] = true; // Ensure it exists and is set to true
      //           return { ...member, relation: newRelation };
      //       }
      //       return member; 
      //   });
    
      //   // Ensure all other insured members remain unchanged
      //   Object.keys(insuredMembers).forEach(key => {
      //     const originalValue = insuredMembers[key]; // Store the original value
      
      //     if (!memberDetails.some(member => member.relation === key)) {
      //         insuredMembers[key] = false; // Mark absent members as false
      //     }
      
      //     // Rename keys like "Self1" to "Self" and "Spouse1" to "Spouse"
      //     const newKey = key.replace(/(Self|Spouse)1$/, "$1");
      //     if (newKey !== key) {
      //         insuredMembers[newKey] = originalValue; // Assign the stored original value
      //         delete insuredMembers[key]; // Remove old key
      //     }
      // });      
      
      //     this.renewalInfoResponse.data = { ...this.renewalInfoResponse.data, insuredMemberDetails: memberDetails,insuredMembers: insuredMembers  };
        } 
        // const renewalInfoResponse: any = await firstValueFrom(this.renewalService.getRenewalInfoApi(renewalInfoRequestBody));

        if (this.renewalInfoResponse.statusCode !== 200 || !this.renewalInfoResponse.isSuccess || Object.keys(this.renewalInfoResponse.data).length === 0) {
            if (this.renewalInfoResponse.message?.toLowerCase().includes("policy renewed")) {
                this.toast.success({ detail: "Success", summary: this.renewalInfoResponse.message || "Renewal Success", duration: 3000 });
            } else {
                this.toast.warning({ detail: "Warning", summary: this.renewalInfoResponse.message || "Error while getting renewal Information.", duration: 3000 });
            }
            return;
        }
        const renewalData = this.renewalInfoResponse.data;

        if (renewalData?.isAutoDebit && !isAutoDebitHandled) {
            this.isAutoDebitModalVisible = true;
            this.selectedProposerDetail = proposerDetail;
            this.selectedAction = action;
            return;
        }

        // if (action === "withmodify") {
        // await this.getProposalNum();
        // await this.getFormSequence();
        // const productData :any = {
        //   partnerId: "74",
        //   productId: renewalData.productId,
        //   proposalNum: this.proposalNum,
        // }
        // sessionStorage.setItem("allFormData", this.encryptionService.encrypt({ ...this.renewalInfoResponse.data,proposalNumber:this.proposalNum}));
        //   const policyNo={
        //     policyNumber:proposerDetail.policyNumber
        //   }
        //   sessionStorage.setItem("formIndex", "0");
        //   console.log(this.formSequence);
        //   this.router.navigate(["renewal/withmodify"], {
        //       state: { productData: productData, formSequence: this.formSequence }
        //   });
        // }

        if (action === "withoutmodify") {
            this.router.navigate(["renewal/renewalJourney"], {
                state: {
                    formData: this.encryptionService.encrypt(renewalData),
                    proposalNum: this.encryptionService.encrypt(this.proposalNum),
                    fromList: this.encryptionService.encrypt("list"),
                    policyNumber: this.encryptionService.encrypt(proposerDetail.policyNumber),
                    journeyProcess: this.encryptionService.encrypt(0),
                    formIndex: "0",
                },
            });
        }
    } catch (err) {
        this.toast.error({ detail: "Error", summary: "Error while processing renewal journey.", duration: 3000 });
    }
}

async getFormSequence() {
  try {
      sessionStorage.clear();
      const reqData = {
          "partnerId": "74",
          "productId":this.renewalInfoResponse.data.productId
      };
      const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
      console.log(res);
      this.formSequence = JSON.parse(res.data.formSequence);
      localStorage.setItem("formIndex", "0");
      console.log(this.formSequence);
      
  } catch (err) {
      this.toast.warning({ detail: "Warning", summary: "Form Configuration not found!!", duration: 2000 });
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

  // @HostListener('document:click', ['$event'])
  // clickOutside(event: Event) {
  //   const clickedInside = (event.target as HTMLElement).closest('.filterWraperForm');
  //   const clickedButton = (event.target as HTMLElement).closest('.jsFilterBtnClick');
  //   if (!clickedInside && !clickedButton && this.toggeledropdown) {
  //     this.toggeledropdown = false;
  //   }
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkView();
  }

  checkView() {
    this.isDesktopView = window.innerWidth <= 1116;
    if (this.isDesktopView) {
      this.selectedView = 'grid';
    } else {
      this.selectedView = 'list';
    }
  }

  onStatusChange(selectedIndex: number): void {
    this.AutoDebitStatus.forEach((status, index) => {
      if (index !== selectedIndex) {
        status.selected = false; // Deselect other options
      }
    });
    this.renewalListRequestBody.autoDebit = this.AutoDebitStatus[selectedIndex].value;
  }

  onTenureChange(selectedIndex: number): void {
    this.TenureList.forEach((tenure, index) => {
      if (index !== selectedIndex) {
        tenure.selected = false;
      }
    });
    this.renewalListRequestBody.tenure = this.TenureList[selectedIndex].value;
  }

  downloadBulk() {
    this.renewalService.downloadRenewalBulkApi(this.renewalListRequestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          const blob = this.commonService.base64ToBlob(response?.data?.fileContentBase64,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          this.commonService.saveAsExcelFile(blob, response?.data?.fileName);     
          console.log(response?.data);
        } else {
          this.toast.error({ detail: "Error", summary: response?.message || "Failed to download bulk renewal notice ", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while downloading bulk renewal notice.", duration: 3000 });
      }
    );
  }

  downloadAudit() {
    const renewalAuditReqBody = {
      "fromDate": this.startDate || this.currentDate,
      "toDate": this.endDate || this.currentDate,
      "agentCode": this.agentCode,
    }

    this.renewalService.downloadRenewalAuditApi(renewalAuditReqBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          const blob = this.commonService.base64ToBlob(response?.data?.fileContentBase64,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          this.commonService.saveAsExcelFile(blob, response?.data?.fileName);     
          console.log(response?.data);
        } else {
          this.toast.error({ detail: "Error", summary: response?.message || "Failed to download Audit History.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while downloading Audit History.", duration: 3000 });
      }
    );
  }

  saveActionData(row: RenewalList, logActionType: string) {
    const todayDate = new Date();
    const localDate = todayDate.toLocaleString();
    const proposerName = (row?.proposerFirstName !== row.proposerLastName) ? `${row?.proposerFirstName} ${row.proposerLastName}` : row?.proposerFirstName;
    const saveActionReqBody = {
      "ProposerName": proposerName,
      "CTAtype": logActionType,
      "IMDName": this.agentName,
      "DateofAction": localDate,
      "EmailId": row?.proposerEmail,
      "MobileNumber": row?.proposerMobileNumber,
      "PolicyNumber": row?.policyNumber,
      "UserId": this.agentCode
    }

    this.renewalService.saveActionAuditDataApi(saveActionReqBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {    
          console.log(response?.data);
        } else {
          this.toast.error({ detail: "Error", summary: response?.message || "Failed to download renewal dump.", duration: 3000 });
        }
      },
      (error) => {
        this.toast.error({ detail: "Error", summary: "Error while downloading renewal dump.", duration: 3000 });
      }
    );
  }
}