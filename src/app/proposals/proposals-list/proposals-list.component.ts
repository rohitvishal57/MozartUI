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
import { error } from 'jquery';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { DatepipePipe } from 'src/app/utilities/pipe/datepipe.pipe';

@Component({
  selector: 'app-proposals-list',
  templateUrl: './proposals-list.component.html',
  styleUrls: ['./proposals-list.component.scss'],
  providers: [DatepipePipe]

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
    "applicationNumber": "",
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
  pageHeading : string = "My Proposals";

  constructor(
    private proposalService: ProposalsService,
    private datePipe: DatePipe,
    private commonService: CommonService, private router: Router,
    private toast: NgToastService,
    private encryptionService: EncryptionService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private yatraService : YatraService,
    private datepipePipe: DatepipePipe
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
        const dateRange = this.datepipePipe.getDateRange(filter);
        this.startDate = dateRange.startDate;
        this.endDate = dateRange.endDate;
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

  onQuotePageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getQuoteList(false);
  }


  getProposal(){
    this.pageHeading ='My Proposals';
    this.countsList = [];
    this.totalRecords = 0;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.searchInputControl.reset();
    this.selected ='';
    this.selectedView = 'list';
    this.first = 0;
    this.rows = 10;
    this.page =1;
    this.proposalListRequestBody.pageNumber = this.page;
    this.proposalListRequestBody.pageSize = this.rows;
    this.proposalListRequestBody.productVarientName= "";
    this.proposalListRequestBody.startDate = null;
    this.proposalListRequestBody.endDate = null;
    this.proposalListRequestBody.mobileNumber = "";
    this.proposalListRequestBody.proposer="";
    this.proposalListRequestBody.proposalNumber="";
    this.proposalListRequestBody.email="";
    this.proposalListRequestBody.leadId="";
    this.proposalListRequestBody.proposalStatus="";
    this.proposalListRequestBody.applicationNumber="";
    this.getProposalList() ;
    this.checkView();  
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
        this.toast.error({ detail: "Error", summary: "Failed to get proposals list.", duration: 2000 });
      }
    );
  }

  getQuoteList(clean : boolean) {
    this.pageHeading = 'My Quotes';
    if(clean){
    this.countsList = [];
    this.totalRecords = 0;
    this.productsList.forEach((product) => (product.selected = false));
    this.startDate = null;
    this.endDate = null;
    this.appliedFiltersCount = 0;
    this.searchInputControl.reset("");
    this.selected ='';
    this.selectedView = 'list';
    this.page =1;
    this.first = 0;
    this.rows = 10;
    this.quoteListRequestBody.productVarientName= "";
    this.quoteListRequestBody.startDate = null;
    this.quoteListRequestBody.endDate = null;
    this.quoteListRequestBody.mobileNumber = "";
    this.quoteListRequestBody.proposalNumber = "";
    this.quoteListRequestBody.name = "";
    this.quoteListRequestBody.quoteId = "";
  this.checkView();  
  }
  this.quoteListRequestBody.pageNumber = this.page;
  this.quoteListRequestBody.pageSize = this.rows;

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
        this.toast.error({ detail: "Error", summary: "Failed to get quote list.", duration: 2000 });
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
        this.toast.error({ detail: "Error", summary: "Failed to get Product Names.", duration: 2000 });
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
    } else if (this.selected === "email") {
      return "Enter Email ID";  
    } else if (this.selected === "proposalStatus") {
      return "Enter Proposal Status";
    } else if (this.selected === "applicationNumber") {
      return "Enter Application Number";
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
    this.proposalListRequestBody.email = "",
    this.proposalListRequestBody.proposalStatus = "",
    this.proposalListRequestBody.applicationNumber = "",
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
        this.proposalListRequestBody.proposalNumber = "",
        this.proposalListRequestBody.proposalStatus = "";
        this.proposalListRequestBody.email = "";
        this.proposalListRequestBody.applicationNumber = "";
      } else if (this.selected === "proposerName") {
        this.proposalListRequestBody.proposer = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber = "",
        this.proposalListRequestBody.proposalStatus = "";
        this.proposalListRequestBody.email = "";
        this.proposalListRequestBody.applicationNumber = "";
      } else if (this.selected === "leadId") {
        this.proposalListRequestBody.leadId = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.proposalNumber = "",
        this.proposalListRequestBody.proposalStatus = "";
        this.proposalListRequestBody.email = "";
        this.proposalListRequestBody.applicationNumber = "";
      } else if (this.selected === "proposalNumber") {
        this.proposalListRequestBody.proposalNumber = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalStatus = "";
        this.proposalListRequestBody.email = "";
        this.proposalListRequestBody.applicationNumber = "";
      } else if (this.selected == "email") {
        this.proposalListRequestBody.email = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalStatus = "";
        this.proposalListRequestBody.proposalNumber = "";
        this.proposalListRequestBody.applicationNumber = "";
      }
      else if (this.selected === "proposalStatus") {
        this.proposalListRequestBody.proposalStatus = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber = ""
        this.proposalListRequestBody.email = "";
        this.proposalListRequestBody.applicationNumber = "";
      }
      else if (this.selected === "applicationNumber") {
        this.proposalListRequestBody.applicationNumber = trimmedValue || "";
        this.proposalListRequestBody.mobileNumber = "";
        this.proposalListRequestBody.proposer = "";
        this.proposalListRequestBody.leadId = "";
        this.proposalListRequestBody.proposalNumber = ""
        this.proposalListRequestBody.email = "";
        this.proposalListRequestBody.proposalStatus = "";
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

   async redirectQuote(quoteInformation : any){
    console.log(quoteInformation);

    try {
      const reqData = {
        partnerId: quoteInformation.partnerId,
        productId: quoteInformation.productId,
        formId: quoteInformation.formId??"0",
        proposalNum: quoteInformation.proposalNum,
        agentCode: this.agentCode,
        currentFormSequence: quoteInformation.currentFormSequence??"0",
        leadId: quoteInformation.leadId,
        firstName: quoteInformation.proposerName,
        proposerGender: ""
      }
      sessionStorage.setItem("formIndex",  (quoteInformation.currentFormSequence ??0).toString());
      const encodedEncryptedData = this.encryptionService.encrypt(reqData);

      this.router.navigate(['yatra'], {
        queryParams: { data: encodedEncryptedData }
      });

    } catch (error) {
      console.error(error);
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
      sessionStorage.setItem("formIndex",   proposalDetails.formSequence.toString());
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
      sessionStorage.setItem("formIndex", "0");
    } catch (err) {
      this.toast.warning({ detail: "Warning", summary: "Form Configuration not found!!", duration: 2000 });
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
    if(email){ 
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
    }else{
      return "";
    }
  }
  
  maskMobileNumber(mobileNumber: any): string {
    return mobileNumber.slice(0, 2) + '*'.repeat(mobileNumber.length - 4) + mobileNumber.slice(-2);
  }


  downloadQuote(proposalNum : any , isProposal : any){
    let requestBody : any ={};
    requestBody.proposalID = proposalNum;
    requestBody.generationType = "";
    requestBody.isDownload = "";
    requestBody.isProposal = isProposal;

    this.proposalService.quoteDownloadPdf(requestBody).subscribe(
      (response)=>{
        if(response.isSuccess){
          let  blob :any = '';
          try{
             blob = this.base64ToBlob(JSON.parse(JSON.parse(response.data)).byteArray, 'application/pdf');
          }catch(exception){
            this.toast.error({ detail: "Error", summary: 'Failed to Generate Quote PDF.', duration: 2000 }); 
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = proposalNum +".pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.toast.success({ detail: "Success", summary: 'Quote Information has Successfully Downloaded and  Shared.', duration: 2000 }); 
        }else{
          this.toast.error({ detail: "Error", summary: response.message, duration: 2000 }); 
        }
      },(error)=>{
        console.log('failed to generate PDF ',error);
      });
  }


  base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const length = binary.length;
    const arrayBuffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      arrayBuffer[i] = binary.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type });
  }

  shareKyc(proposalInformation : any){
    let requestPayload: any = {};
    requestPayload.policyNumber = "";
    requestPayload.proposerNumber = proposalInformation.proposalNumber;
    requestPayload.fullName = proposalInformation.firstName  + proposalInformation.lastName ;
    requestPayload.panNumber = "";
    requestPayload.dob = "";
    requestPayload.pepCheck = "No";
    requestPayload.businessType = "NB";
    requestPayload.emailId = proposalInformation.emailId;
    requestPayload.agentCode = this.agentCode;
    requestPayload.MobileNumber = proposalInformation.mobileNumber;
    requestPayload.ProductName = proposalInformation.productVarientName;
    requestPayload.ProductCode = "";
  }

  shareProposalSummary(proposalDetails: any) {
    let requestBody: any = {};
    requestBody.emailId = proposalDetails.proposerEmail;
    requestBody.mobileNumber = proposalDetails.mobileNo;
    requestBody.name = proposalDetails.firstName + " " + proposalDetails.lastName;
    requestBody.agentCode = this.agentCode;
    requestBody.proposalNumber = proposalDetails.proposalNumber;
    requestBody.premiumAmount = proposalDetails.totalPremiumInt.toString();
    requestBody.productName = proposalDetails.productVarientName;

    this.proposalService.shareSummary(requestBody).subscribe(
      (response) => {
        if(response.isSuccess){
          this.toast.success({ detail: "Success", summary: 'Proposal Summary Info Shared Successfully.', duration: 2000 }); 
        }
      },
      (error) => {
        console.log('failed to Share Proposal Summary Info',error);

      });
  }

  async insurenow(item: any) {
    console.log(item);
    item.tenureAmounts = [];
    this.formData = {
      ...JSON.parse(item.quoteData), productName: item.productName, totalPremium: item.selectedPremiumAmount,
      firstName: item.proposerName, quoteId: item.quoteNumber, proposalNumber: item.proposalNum
    }
    console.log(this.formData);
    try {
      await this.getFormSequence(item);
      for (let i = 1; i <= 3; i++) {
        const premiumKey = `t${i}PremiumAmount`;
        console.log(item[premiumKey]);
        if (item.selectedPremiumAmount == item[premiumKey]) {
          item.tenure = i;
        }
        item.tenureAmounts[i - 1] = item[premiumKey]
      }
      this.formData = {
        ...this.formData, tenure: item.tenure + ' years'
      }
      console.log(item, this.formData)
      const productData = {
        partnerId: item.partnerId,
        productId: item.productId,
        tenureAmounts: item.tenureAmounts,
        selectedAddons: item.selectedAddons,
        proposalNum: item.proposalNum,
        tenure: item.tenure
      }
      sessionStorage.setItem("isQuote", true.toString());
      console.log(productData)
      if (this.formSequence != null && this.formSequence.length > 0) {
        this.router.navigate(['yatra'], {
          state: { productData: productData, formSequence: this.formSequence }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  sharePaymentLink(proposalInfo: any) {
    let requestBody: any = {};

    requestBody.firstName = proposalInfo.firstName;
    requestBody.lastName = proposalInfo.lastName;
    requestBody.agentcode = this.agentCode;
    requestBody.emailId = proposalInfo.proposerEmail;
    requestBody.productName = proposalInfo.productVarientName;
    requestBody.pNumber = proposalInfo.proposalNumber;
    requestBody.businessType = 'NB';
    requestBody.productCode = proposalInfo.productVarientName; 
    requestBody.premiumAmount = proposalInfo.totalPremiumInt.toString();
    requestBody.mobilenumber = proposalInfo.mobileNo;

    this.yatraService.sharePaymentLink(requestBody).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.toast.success({ detail: "Success", summary: response.data.message, duration: 2000 });
        } else {
          this.toast.error({ detail: "Error", summary: response.data.message, duration: 2000 });
        }

      }, (error) => {
        console.log('failed to send communication', error);
        this.toast.error({ detail: "Error", summary: "Failed to send communincation", duration: 2000 });

      });
  }

}
