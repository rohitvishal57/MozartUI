import { DatePipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { searchValidationConfig } from 'src/app/interface/common-validation.interface';
import { LeadsList } from 'src/app/leads/leads-list.interface';
import { LeadsService } from 'src/app/leads/leads.service';
import { ProductsService } from 'src/app/product/products/products.service';
import { AdminService } from 'src/app/rug/Admin/admin.service';
import { RugService } from 'src/app/rug/rug.service';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-hdfc-bata-leads-list',
  templateUrl: './hdfc-bata-leads-list.component.html',
  styleUrls: ['./hdfc-bata-leads-list.component.scss']
})
export class HdfcBataLeadsListComponent {
  allbataLead: any;
  filterType: string = "totalRecords";
  countsList: any = [];
  activeFilter: string = "all";
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  selectedView: string = "list";
  productsList: any[] = [];
  appliedFiltersCount: number = 0;
  toggeledropdown: boolean = false;
  toggeleSearchdropdown: boolean = false;
  selected: string = '';
  searchInputControl = new FormControl("");
  isDesktopView: boolean = false;
  agentCode = localStorage.getItem('agentCode');
  placeholder: string = '';
  assigneLeadModal: any;
  agentCodes: any = [];
  assignLeadForm!: FormGroup;
  updateStatusForm!: FormGroup;
  selectedLeadAssignee: string = '';
  selectedLeadNumbers: string[] = [];
  selectedleadInformation: any = {};
  displayNotesPopup = false;
  displayAuditTrailPopup = false;
  displayUpdateStatusPopup = false;
  markDuplicatePopup = false;
  duplicateLeadId: any;
  activityTypes: any = [];
  addNoteForm!: FormGroup;
  markDuplicateForm!: FormGroup;
  mobileNumber: string = '';
  selectedCheckBox = false
  checkBoxSelectedLeads: any = [];
  auditTrails: any;
  statusUpdateLead: any;
  startDate: any;
  endDate: any;
  displayedLeads: any[] = [];
  searchTerm: string = '';
  todayDate: any = new Date().toISOString().split('T')[0];
  filterLeads = false;
  today: string = '';
  isSummery:boolean = false;
  StaticPolicyTypes = [
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  leadFilterStatus = [
    { "name": "Open", "selected": false },
    { "name": "In progress", "selected": false },
    { "name": "Won", "selected": false },
    { "name": "Lost", "selected": false },
    { "name": "Lead Aged", "selected": false }
  ];
  private allJsonFormData: any[] = [];
  formData: any = {};
  interestedProductName: string = '';
  interestedProductItem: any = '';
  ProductList: any = [];
  leadId: any;

  constructor(
    private rugService: RugService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private toast: NgToastService,
    private productService: ProductsService,
    private encryptionService: EncryptionService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) { }

  leadsInfoListRequestBody = {
    "productName": "",
    "agentCode": this.agentCode,
    "name": "",
    "leadNumber": "",
    "email": "",
    "leadAssigne": "",
    "policyType": "",
    "startDate": null,
    "endDate": null,
    "pageNumber": this.page,
    "pageSize": this.rows,
    "mobileNumber": "",
    "filterType": "",
    "leadStatus": ""
  }

  ngOnInit(): void {
    this.getLeadsList();
    window.scrollTo(0, 0);

    this.languageService.language$.subscribe((lang: any) => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

    this.activatedRoute.queryParams.subscribe((params: any) => {
      let routeLeadStatus = params['status'];
      const filter = params['filter'];
      if (routeLeadStatus && filter) {
        this.leadFilterStatus.map((leadStatus: any) => {
          if (leadStatus.name == routeLeadStatus) {
            leadStatus.selected = true;
          }
        });
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
        }
        this.applyFilter();
      }
    });
  }

  
  getLeadsList() {
    const req = {
      agentcode: this.agentCode,
      partnerId: "62",
      filters: {
        LeadID: this.leadsInfoListRequestBody.leadNumber ? [this.leadsInfoListRequestBody.leadNumber] : [] 
      },
      pageNumber: this.page,
      pageSize: this.rows,
    };
  
    this.rugService.getLeadDetailsBata(req).subscribe(
      (response: any) => {
        const res = JSON.parse(response.data);
        this.allbataLead = res.data.leadDetails.reverse();
        this.displayedLeads = [...this.allbataLead];
        this.totalRecords = this.searchTerm ? this.allbataLead.length : res.data.totalRecords;

        if (this.allbataLead.length === 0 && this.searchTerm) {
          this.displayedLeads = [];
        }
      }
    );
  }
  

  onPageChange(event: any): void {
    if (!this.searchTerm) {
      this.first = event.first;
      this.rows = event.rows;
      this.page = Math.floor(this.first / this.rows) + 1;
      this.getLeadsList();
    }
  }


  filterQuotes(filter: string, filterRange: string) {
    this.leadsInfoListRequestBody.filterType = filter;
    this.first = 0; this.page = 1;
    this.getLeadsList();
    this.activeFilter = filter;
    this.filterType = filterRange;
  }

  toggleFilterDropdown() {
    if (this.toggeleSearchdropdown == true) {
      this.toggeleSearchdropdown = false;
    }
    this.toggeledropdown = !this.toggeledropdown;
  }
  calculateAppliedFiltersCount() {
    const selectedProductsCount = this.productsList.filter((product) => product.selected).length;
    const selectedpolicyTypeCount = this.StaticPolicyTypes.filter((policyType) => policyType.selected).length;
    const selectedLeadStatus = this.leadFilterStatus.filter((leadStatus) => leadStatus.selected).length;
    let count = selectedProductsCount + selectedpolicyTypeCount + selectedLeadStatus;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count || 0;
  }

  applyFilter() {
    // this.filterLeads = true;
    this.calculateAppliedFiltersCount();
    const selectedProducts = this.productsList.filter((product) => product.selected)
      .map((product) => product.productName);
    const selectedPolicyTypes = this.StaticPolicyTypes.filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
    const selectedLeadStatus = this.leadFilterStatus.filter((leadStatus) => leadStatus.selected)
      .map((leadStatus) => leadStatus.name);
    this.leadsInfoListRequestBody.productName = selectedProducts.join(",");
    this.leadsInfoListRequestBody.policyType = selectedPolicyTypes.join(",");
    this.leadsInfoListRequestBody.leadStatus = selectedLeadStatus.join(",");
    this.leadsInfoListRequestBody.startDate = this.startDate;
    this.leadsInfoListRequestBody.endDate = this.endDate;
    this.first = 0;
    this.page = 1;
    this.getLeadsList();
    this.toggeledropdown = false;
  }
  cancel() {
    this.filterLeads = false;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.leadFilterStatus.forEach((leadStatus) => (leadStatus.selected = false));
    this.appliedFiltersCount = 0;
    this.toggeledropdown = false;
    this.startDate = "";
    this.endDate = "";

    // this.leadsInfoListRequestBody.searchby = "";
    this.getLeadsList();
  }
  clear() {
    this.leadsInfoListRequestBody.startDate = null;
    this.leadsInfoListRequestBody.endDate = null;
    this.filterLeads = false;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.leadFilterStatus.forEach((leadStatus) => (leadStatus.selected = false));
    this.leadsInfoListRequestBody.productName = "";
    this.leadsInfoListRequestBody.policyType = "";
    this.leadsInfoListRequestBody.leadStatus = "";
    this.appliedFiltersCount = 0;
    this.startDate = null;
    this.endDate = null;
    this.getLeadsList();
  }
  toggleSearchDropdown() {
    if (this.toggeledropdown == true) {
      this.toggeledropdown = false;
    }
    this.toggeleSearchdropdown = !this.toggeleSearchdropdown;
  }

  onSelectChanges(event: any): void {
    this.searchInputControl.reset("");
    this.searchInputControl.clearValidators();
    const selectedValidators = searchValidationConfig[this.selected] || [];
    this.searchInputControl.setValidators(selectedValidators);
    this.searchInputControl.updateValueAndValidity();
    if (this.selected == '') {
      this.leadsInfoListRequestBody.name = '';
      this.leadsInfoListRequestBody.mobileNumber = '';
      this.leadsInfoListRequestBody.email = '';
      this.leadsInfoListRequestBody.leadAssigne = '';
      this.leadsInfoListRequestBody.leadNumber = '';
      this.getLeadsList();
    }
  }

  applySearch() {
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim();
      this.searchTerm = trimmedValue || ""; 
  
      if (this.selected === "mobileNumber") {
        this.leadsInfoListRequestBody.mobileNumber = this.searchTerm;
        this.leadsInfoListRequestBody.leadNumber = "";
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadAssigne = "";
      } else if (this.selected === "leadID") {
        this.leadsInfoListRequestBody.leadNumber = this.searchTerm;
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadAssigne = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      } else if (this.selected === "name") {
        this.leadsInfoListRequestBody.name = this.searchTerm;
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadNumber = "";
        this.leadsInfoListRequestBody.leadAssigne = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      } else if (this.selected === "emailID") {
        this.leadsInfoListRequestBody.email = this.searchTerm;
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.leadNumber = "";
        this.leadsInfoListRequestBody.leadAssigne = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      } else if (this.selected === "AssignedTo") {
        this.leadsInfoListRequestBody.leadAssigne = this.searchTerm;
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadNumber = "";
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      }
  
      this.first = 0;
      this.page = 1;
      this.getLeadsList(); 
    }
  }
  

  renewalListView(view: string) {
    this.selectedView = view;
  }
  showAssigneLeadDialog(leadInformation: any) {
    if (!this.checkBoxSelectedLeads.some((lead: any) => lead.leadNumber === leadInformation.leadNumber)) {
      this.checkBoxSelectedLeads.push(leadInformation);
    }
    this.assigneLeadModal.show();
  }


  assineLead() {

  }

  cancelAssignModal() {
    this.checkBoxSelectedLeads = [];
  }

  toggleAll(event: Event) {
    const input = event.target as HTMLInputElement;
    this.allbataLead.forEach((lead: any) => lead.isSelected = input.checked)
    this.checkBoxSelectedLeads = this.allbataLead.filter((lead: any) => lead.isSelected);
  }
  updateSelectedLeads(leadInfo: any) {
    if (this.checkBoxSelectedLeads.some((lead: any) => lead.leadNumber === leadInfo.leadNumber)) {
      this.checkBoxSelectedLeads = this.checkBoxSelectedLeads.filter((lead: any) => lead.leadNumber !== leadInfo.leadNumber);
    } else {
      this.checkBoxSelectedLeads.push(leadInfo);
    }
  }
  selectAllAssigneLeadDialog() {
    this.showAssigneLeadDialog(this.selectedleadInformation);
  }
  getPlaceholder(): string {
    if (this.selected === 'leadId') {
      return 'Enter Lead ID';
    } else if (this.selected === 'mobileNumber') {
      return 'Enter Mobile Number';
    } else if (this.selected === 'name') {
      return 'Enter Name';
    } else if (this.selected === 'emailID') {
      return 'Enter Email ID';
    } else if (this.selected === 'AssignedTo') {
      return 'Enter AgentCode';
    } else {
      return 'Search...';
    }
  }

  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }


    if (this.startDate > new Date().toISOString().split('T')[0]) {
      this.startDate = '';
      this.toast.warning({ detail: "Warning", summary: 'StartDate should not be greater than today date.', duration: 5000 });
    }

  }

  formatCreatedOn(dateString: string | null | undefined) {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    return formattedDate || 'Invalid Date'; // Handle invalid date
  }

  restrictInput(event: KeyboardEvent): void {
    if (this.selected === 'mobileNumber' && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
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


  async generateProposalNumnberAndUpdateLeadInfor(leadNumber: any) {


  }



  maskEmail(email: any): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }

  maskMobileNumber(mobileNumber: any): string {
    return mobileNumber.slice(0, 2) + '*'.repeat(mobileNumber.length - 4) + mobileNumber.slice(-2);
  }

  createBataLeads() {
    this.isSummery = false;
    this.router.navigate(['rug/hdfc_createBataLeads']);
  }

  actionLead(lead: any) {
    console.log(lead);
    localStorage.setItem('viewLeadDetails', JSON.stringify(lead)); 
    sessionStorage.setItem('isSummery', 'true'); 
    sessionStorage.setItem('leadId', lead.leadID); 
    this.router.navigate(['rug/bata-details']);
  }
}
