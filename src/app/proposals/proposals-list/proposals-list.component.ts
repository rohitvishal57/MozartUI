import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ProposalList } from 'src/app/interface/proposals.interface';
import { ProposalsService } from '../proposals.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { EncryptionService } from 'src/app/services/encryption.service';
import { searchValidationConfig } from 'src/app/interface/common-validation.interface';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { GalleriaThumbnails } from 'primeng/galleria';

@Component({
  selector: 'app-proposals-list',
  templateUrl: './proposals-list.component.html',
  styleUrls: ['./proposals-list.component.scss']
})
export class ProposalsListComponent {
  proposalList: ProposalList[] = [];
  quoteList: any = [];
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
  isDesktopView: boolean = false
  filterType: string = "totalRecords";
  agentCode = localStorage.getItem('agentCode');
  StaticPolicyTypes = [
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  proposalNum: any;
  formSequence: any[] = [];
  allJsonFormData: any[] = []
  formData: any = {}
  currentDate = new Date().toISOString().split('T')[0];
  proposalListRequestBody = {
    "proposer": "",
    "productVarientName": "",
    "proposalNumber": "",
    "agentCode": this.agentCode,
    "policyType": "",
    "proposalStatus": "",
    "startDate": null as string | null,
    "endDate": null as string | null,
    "pageNumber": this.page,
    "pageSize": this.rows,
    "mobileNumber": "",
    "filterType": "",
    "email": "",
    "leadId": ""
  }

  quoteListRequestBody = {
    "agentCode": this.agentCode,
    "name": "",
    "productVarientName": "",
    "proposalNumber": "",
    "startDate": null as string | null,
    "endDate": null as string | null,
    "pageNumber": this.page,
    "pageSize": this.rows,
    "mobileNumber": "",
    "filterType": "",
    "quoteId": ""
  }

  searchApplied: boolean = false;

  constructor(
    private proposalService: ProposalsService,
    private datePipe: DatePipe,
    private commonService: CommonService, private router: Router,
    private toast: NgToastService,
    private encryptionService: EncryptionService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let routeStatus = params['status'];
      const filter = params['filter'];
      if (routeStatus && filter) {
        console.log("route status", routeStatus);
        this.selected = "proposalStatus"
        this.searchInputControl.setValue(routeStatus);
        this.applySearch();
      }
      if (filter) {
        console.log("route filter", filter);
        const currentDate = new Date();
        switch (filter) {
          case 'Last7Days':
            this.startDate = this.datePipe.transform(
              new Date(currentDate.setDate(currentDate.getDate() - 7)),
              'yyyy-MM-dd'
            );
            this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            break;

          case 'LastMonth':
            const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            this.startDate = this.datePipe.transform(lastMonthStart, 'yyyy-MM-dd');
            this.endDate = this.datePipe.transform(lastMonthEnd, 'yyyy-MM-dd');
            break;

          case 'QuarterWise':
            const currentMonth = currentDate.getMonth();
            const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
            const quarterStartDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1);
            const quarterEndDate = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0);
            this.startDate = this.datePipe.transform(quarterStartDate, 'yyyy-MM-dd');
            this.endDate = this.datePipe.transform(quarterEndDate, 'yyyy-MM-dd');
            break;

          case 'FinancialYear':
            const year = currentDate.getMonth() >= 3 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
            const financialYearStartDate = new Date(year, 3, 1); // April 1st
            const financialYearEndDate = new Date(year + 1, 2, 31); // March 31st
            this.startDate = this.datePipe.transform(financialYearStartDate, 'yyyy-MM-dd');
            this.endDate = this.datePipe.transform(financialYearEndDate, 'yyyy-MM-dd');
            break;

          default:
            console.log("Unknown filter:", filter);
            break;
        }
        this.applyFilter();
      }
    });
    this.getProposalList();
    this.getProducts();
    this.checkView(); //Screen View check
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getProposalList();
  }


  getProposal(){
    this.countsList = [];
    this.totalRecords = 0;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.proposalListRequestBody.pageNumber = this.page;
    this.proposalListRequestBody.pageSize = this.rows;
    this.proposalListRequestBody.productVarientName= "";
    this.proposalListRequestBody.startDate = null;
    this.proposalListRequestBody.endDate = null;
    this.proposalListRequestBody.mobileNumber = "";
    this.proposalListRequestBody.proposer="";
    this.proposalListRequestBody.proposalNumber="";
    this.proposalListRequestBody.leadId="";
    this.proposalListRequestBody.proposalStatus="";
    this.searchInputControl.reset();
    this.selected ='';
    this.getProposalList() ;
  }

  getProposalList() {
    this.proposalListRequestBody.pageNumber = this.page;
    this.proposalListRequestBody.pageSize = this.rows;
    this.proposalService.getProposalListApi(this.proposalListRequestBody).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.proposalList = response.data.proposalList.map((item: any) => ({
            ...item, policyStartDate: this.formatStartDate(item.policyStartDate)
          }));
          console.log("proposal List", this.proposalList);
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType];
        }
        else {
          console.error("API request was not successful.");
        }
      },
      (error) => {
        this.toast.error({ detail: "", summary: "Failed to get proposals list.", duration: 2000 });
      }
    );
  }

  getQuoteList(clean : boolean) {
    if(clean){
    this.countsList = [];
    this.totalRecords = 0;
    this.productsList.forEach((product) => (product.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.quoteListRequestBody.pageNumber = this.page;
    this.quoteListRequestBody.pageSize = this.rows;
    this.quoteListRequestBody.productVarientName= "";
    this.quoteListRequestBody.startDate = null;
    this.quoteListRequestBody.endDate = null;
    this.quoteListRequestBody.mobileNumber = "";
    this.quoteListRequestBody.proposalNumber = "";
    this.quoteListRequestBody.name = "";
    this.quoteListRequestBody.quoteId = "";
    this.searchInputControl.reset("");
    this.selected ='';
    }

    this.proposalService.getQuoteListApi(this.quoteListRequestBody).subscribe(
      (response) => {
        if (response.isSuccess) {
           this.quoteList =  response?.data?.cartList.map((item: any) => ({
            ...item, createdOn: this.formatStartDate(item.createdOn)
          }));

           this.countsList = response?.data;
           this.totalRecords = response.data[this.filterType];
        }
      }, (error) => {
        this.toast.error({ detail: "", summary: "Failed to get quote list.", duration: 2000 });
      });
  }

  
  filterQuotes(filter: string, filterRange: string) {
    this.proposalListRequestBody.filterType = filter;
    this.first = 0; this.page = 1;
    this.getProposalList();
    this.activeFilter = filter;
    this.filterType = filterRange;
  }

  filterQuoteDate(filter: string, filterRange: string) {
    this.quoteListRequestBody.filterType = filter;
    this.first = 0; this.page = 1;
    this.getQuoteList(false);
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
    const productsReqBody = {
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(productsReqBody).subscribe({
      next: (res) => {
        console.log("product list", this.productsList)
        this.productsList = res.data
      },
      error: (err) => {
        this.toast.error({ detail: "", summary: "Failed to get Product Names.", duration: 2000 });
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
    this.proposalListRequestBody.startDate = this.startDate;
    console.log("start date taken by request body", this.proposalListRequestBody.startDate);
    this.proposalListRequestBody.endDate = this.endDate;
    console.log("end date taken by request body", this.proposalListRequestBody.endDate);
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
    console.log("selectedProducts", selectedProducts);
    this.proposalListRequestBody.productVarientName = selectedProducts.join(", ");
    console.log("product names which are taking by request body", this.proposalListRequestBody.productVarientName);
    const selectedPolicyTypes = this.StaticPolicyTypes
      .filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
    console.log("selected policy types", selectedPolicyTypes);
    this.proposalListRequestBody.policyType = selectedPolicyTypes.join(", ");
    console.log("policy types which are taking by request body", this.proposalListRequestBody.policyType);
    this.first = 0;
    this.page = 1;
    this.getProposalList();
    this.toggeledropdown = false;
  }

  quoteApplyFilter() {
    this.calculateAppliedFiltersCount();
    this.formatDate("startDate");
    this.formatDate("endDate");
    this.quoteListRequestBody.startDate = this.startDate;
    this.quoteListRequestBody.endDate = this.endDate;
    const selectedProducts = this.productsList.filter((product) => product.selected).map((product) => product.productName);
    this.quoteListRequestBody.productVarientName = selectedProducts.join(", "); 
    this.first = 0;
    this.page = 1;
    this.getQuoteList(false);
    this.toggeledropdown = false;
  }

  cancel() {
    this.toggeledropdown = false;
  }
  clear() {
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

  quoteClear() {
    this.productsList.forEach((product) => (product.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.quoteListRequestBody.productVarientName = "";
    this.quoteListRequestBody.startDate = null;
    this.quoteListRequestBody.endDate = null;
    this.getQuoteList(false);
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
    } else if (this.selected === "proposalStatus") {
      return "Enter Proposal Status";
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
    this.proposalListRequestBody.proposalNumber = "",
      this.proposalListRequestBody.proposalStatus = "",
      this.searchInputControl.reset();
    this.searchApplied = false;
    this.getProposalList();
  }
  quoteCancelSearch() {
    this.selected = "";
    this.quoteListRequestBody.mobileNumber = "";
    this.quoteListRequestBody.name = "";
    this.quoteListRequestBody.quoteId = "";
    this.quoteListRequestBody.proposalNumber = "",
      this.searchInputControl.reset();
    this.searchApplied = false;
    this.getQuoteList(false);
  }
  applySearch() {
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim();
      if (this.selected === "mobileNumber") {
        this.proposalListRequestBody.mobileNumber = trimmedValue || "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber = ""
        this.proposalListRequestBody.proposalStatus = "";
      } else if (this.selected === "proposerName") {
        this.proposalListRequestBody.proposer = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber = ""
        this.proposalListRequestBody.proposalStatus = "";
      } else if (this.selected === "leadId") {
        this.proposalListRequestBody.leadId = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.proposalNumber = ""
        this.proposalListRequestBody.proposalStatus = "";
      } else if (this.selected === "proposalNumber") {
        this.proposalListRequestBody.proposalNumber = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalStatus = "";
      }
      else if (this.selected === "proposalStatus") {
        console.log("seleted", this.selected);
        this.proposalListRequestBody.proposalStatus = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber = ""
      }
      this.first = 0;
      this.page = 1;
      this.getProposalList();
    }
  }

  quoteapplySearch() {
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim();
      if (this.selected === "mobileNumber") {
        this.quoteListRequestBody.mobileNumber = trimmedValue || "";
        this.quoteListRequestBody.name = "";
        this.quoteListRequestBody.quoteId = "";
        this.quoteListRequestBody.proposalNumber = ""
      } else if (this.selected === "proposerName") {
        this.quoteListRequestBody.name = trimmedValue || "";
        this.quoteListRequestBody.mobileNumber = "";
        this.quoteListRequestBody.quoteId = "";
        this.quoteListRequestBody.proposalNumber = ""
      }else if (this.selected === "proposalNumber") {
        this.quoteListRequestBody.proposalNumber = trimmedValue || "";
        this.quoteListRequestBody.mobileNumber = "";
        this.quoteListRequestBody.name = "";
        this.quoteListRequestBody.quoteId = "";
      }else if (this.selected === "quoteId") {
        this.quoteListRequestBody.quoteId = trimmedValue || "";
        this.quoteListRequestBody.mobileNumber = "";
        this.quoteListRequestBody.name = "";
        this.quoteListRequestBody.proposalNumber = ""
      }
      this.first = 0;
      this.page = 1;
      this.getQuoteList(false);
    }
  }
  triggerSearch(): void {
    if (!this.selected) {
      console.log("No dropdown option selected");
      return;
    }  
    if (this.searchInputControl.valid && this.searchInputControl.value?.trim()) {
      console.log("Valid input", this.searchInputControl.value);  
      if (!this.searchApplied) {
        this.applySearch();
        this.searchApplied = true;
      } else {
        this.cancelSearch();
        this.searchApplied = false;
      }
    } else {
      console.log("Invalid input or empty value");
    }
  }

  quoteTriggerSearch(): void {
   if(this.searchInputControl.valid){
    if (!this.searchApplied) {
      this.quoteapplySearch();
      this.searchApplied = true;
    } else {
      this.quoteCancelSearch();
      this.searchApplied = false;
    }
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
  async redirect(proposalDetails: any) {

    console.log(proposalDetails);

    try {
      const reqData = {
        partnerId: proposalDetails.partnerId,
        productId: proposalDetails.productId,
        formId: proposalDetails.formId,
        proposalNum: proposalDetails.proposalNumber,
        agentCode: this.agentCode,
        currentFormSequence: proposalDetails.formSequence,
        leadId: proposalDetails.leadId
      }
      localStorage.setItem("formIndex", proposalDetails.formSequence.toString());
      const encodedEncryptedData = this.encryptionService.encrypt(reqData);

      this.router.navigate(['yatra'], {
        queryParams: { data: encodedEncryptedData }
      });
      // await this.getProposalNum();
      // const productData = {
      //  "partnerId": 1,
      // "productId": 1,
      // "formId": 1,
      // "proposalNum": "UPP110611475112",
      // "agentCode": "4620973",
      // "currentFormSequence": "0
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
      this.toast.warning({ detail: "", summary: "Form Configuration not found!!", duration: 2000 });
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
    } else {
      this.selectedView = 'list'; // Use 'grid' view for desktop
    }
  }
  maskEmail(email: any): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }
  
  maskMobileNumber(mobileNumber: any): string {
    return mobileNumber.slice(0, 2) + '*'.repeat(mobileNumber.length - 4) + mobileNumber.slice(-2);
  }
}
