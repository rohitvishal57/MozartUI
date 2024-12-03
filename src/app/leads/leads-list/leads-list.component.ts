import { Component } from '@angular/core';
import { LeadsList } from '../leads-list.interface';
import { FormControl, Validators } from '@angular/forms';
import { LeadsService } from '../leads.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { NgToastService } from 'ng-angular-popup';
import { ProductsService } from 'src/app/product/products/products.service';
import { firstValueFrom } from 'rxjs';
import { EncryptionService } from 'src/app/services/encryption.service';
import { searchValidationConfig }  from 'src/app/interface/common-validation.interface';
declare var bootstrap: any;
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent {
  
  leadsList: LeadsList[] = [];
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
  todayDate : any = new Date().toISOString().split('T')[0];
  filterLeads = false;
  today: string = '';
  StaticPolicyTypes = [
    { name: 'Multi Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  leadFilterStatus  = [
    { "name": "Open", "selected": false },
    { "name": "In progress", "selected": false },
    { "name": "Won", "selected": false },
    { "name": "Lost", "selected": false }
  ];
  private allJsonFormData: any[] = [];
  formData: any = {};
  interestedProductName : string ='';
  interestedProductItem : any = '';
  ProductList :any = [];
  leadId: any;

  constructor(
    private leadsService: LeadsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private toast: NgToastService,
    private productService: ProductsService,
    private common: CommonService,
    private encryptionService: EncryptionService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }


  leadsInfoListRequestBody = {
    "agentcode": this.agentCode,
    "myleads": true,
    "assignedleads": true,
    "unassignedleads": true,
    "start": 1,
    "viewBy": [
      ""
    ],
    "length": 10,
    "searchby": "",
    "searchlist": "",
    "fromdate": null,
    "todate": null,
    "policyList": "",
    "statusList":"",
    "isSellerPortal": true
  }

  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

    this.activatedRoute.queryParams.subscribe((params : any) => {
      let routeLeadStatus  = params['leadstatus'];
      if(routeLeadStatus){
        this.leadFilterStatus.map((leadStatus:any)=>{
         if(leadStatus.name == routeLeadStatus){
          leadStatus.selected = true;
         } 
        });
        this.applyFilter();
      }
    });

    this.assigneLeadModal = new bootstrap.Modal(document.getElementById('assigneLeadModal'));
    this.agentCode = localStorage.getItem('agentCode');
    this.getLeadsList();
    this.getProducts();
    this.fetchReportingUsers();
    this.assignLeadForm = this.fb.group({
      selectedAgentCode: ['']
    });
    this.markDuplicateForm = this.fb.group({
      leadId: ['']
    });

    this.today = new Date().toISOString().split('T')[0];

  }
  fetchActivityType(event: any) {
    let fetchActivityTypeRequest: any = {};
    this.leadsService.fetchActivityType(fetchActivityTypeRequest).subscribe(
      (response) => {
        this.activityTypes = response.activityName;
      },
      (error) => {
        console.log("Failed to Fetch Activity Type information : ", error);
      });
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getLeadsList();
  }
  getLeadsList() {
    this.leadsInfoListRequestBody.start = this.page;
    this.leadsInfoListRequestBody.length = this.rows;
    this.leadsService.getLeadsListApi(this.leadsInfoListRequestBody).subscribe(
      (response) => {
        if (response) {
          this.leadsList = response.data.leadList;
          console.log("Renewal List", this.leadsList);
          this.countsList = response.data;
          this.totalRecords = this.countsList.totalCount;
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  updateLeadStatus(leadNumber: any) {
    this.router.navigate(['/leads/updateLead'], {
      queryParams: { leadNumber: leadNumber, action: 'updateStatus' },
    });
  }
  addNotesLead(leadNumber: any) {
    this.router.navigate(['/leads/updateLead'], {
      queryParams: { leadNumber: leadNumber, action: 'addNotes' },
    });
  }
  markDuplicate(leadNumber: any) {
    console.log(leadNumber);
    this.duplicateLeadId = leadNumber;
    this.markDuplicatePopup = true;
  }
  markDuplicateFormSubmit() {
    console.log(this.markDuplicateForm.value);
    let reqObject = {
      leadnumber: this.duplicateLeadId,
      duplicateof: this.markDuplicateForm.get('leadId')?.value
    }
    this.leadsService.getDuplicateLead(reqObject).subscribe(
      (response) => {
        console.log(response);
        this.markDuplicatePopup = false;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
        this.markDuplicatePopup = false;
      }
    );
  }
  filterQuotes(filter: string) {
    this.leadsInfoListRequestBody.myleads = true;
    this.leadsInfoListRequestBody.assignedleads = true;
    this.leadsInfoListRequestBody.unassignedleads = true;
    this.filterLeads = false;
    this.getLeadsList();
    this.activeFilter = filter;
  }
  getProducts() {
    const reqData = {
      agentCode: this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
        console.log("product list", this.productsList)
      },
      error: (err) => {
        console.log("error coming form getproduct list API",err);
      }
    });
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
    let count = selectedProductsCount + selectedpolicyTypeCount+selectedLeadStatus;
    if (this.startDate && this.endDate) {
      count++;
    }
    this.appliedFiltersCount = count || 0;
  }

  applyFilter() {
    this.page =1;
    this.first = 0;
    this.rows = 10;
    this.filterLeads = true;
    this.calculateAppliedFiltersCount();
    const selectedProducts = this.productsList.filter((product) => product.selected)
      .map((product) => product.productName);
    const selectedPolicyTypes = this.StaticPolicyTypes.filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
      const selectedLeadStatus = this.leadFilterStatus.filter((leadStatus) => leadStatus.selected)
      .map((leadStatus) => leadStatus.name);
    this.leadsInfoListRequestBody.searchlist = selectedProducts.join(", ");
    this.leadsInfoListRequestBody.policyList = selectedPolicyTypes.join(", ");
    this.leadsInfoListRequestBody.statusList = selectedLeadStatus.join(",");
    this.leadsInfoListRequestBody.fromdate = this.startDate || null;
    this.leadsInfoListRequestBody.todate = this.endDate || null;
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
    this.leadsInfoListRequestBody.searchby = "";
    this.getLeadsList();
  }
  clear() {
    this.leadsInfoListRequestBody.searchlist = "";
    this.leadsInfoListRequestBody.searchby = "";
    this.leadsInfoListRequestBody.policyList = "";
    this.leadsInfoListRequestBody.fromdate = null;
    this.leadsInfoListRequestBody.todate = null;
    this.filterLeads = false;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.leadFilterStatus.forEach((leadStatus) => (leadStatus.selected = false));
    this.appliedFiltersCount = 0;
    this.startDate = "";
    this.endDate = "";
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
        this.leadsInfoListRequestBody.searchby = '';
        this.getLeadsList();
      }
  }


  applySearch() {
    this.page =1;
    this.first = 0;
    this.rows = 10;
    if(this.activeFilter== 'assignedLead'){
      this.leadsInfoListRequestBody.assignedleads = true;
      this.leadsInfoListRequestBody.unassignedleads = false;

    }else if(this.activeFilter == 'unAssignedLead'){
      this.leadsInfoListRequestBody.assignedleads = false;
      this.leadsInfoListRequestBody.unassignedleads = true;
    }else{
      this.leadsInfoListRequestBody.assignedleads = true;
      this.leadsInfoListRequestBody.unassignedleads = true;
    }

    this.leadsInfoListRequestBody.searchby = this.searchInputControl.value?.trim() || '';
    this.getLeadsList();

    
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
  showAuditTrailDialog(leadNumber: any) {
    this.leadsService.viewAuditTrail(leadNumber).subscribe(
      (response) => {
        this.displayAuditTrailPopup = true;
        this.auditTrails = response;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }
  fetchReportingUsers() {
    let requestBody: any = {}
    requestBody.agentCode = this.agentCode
    this.leadsService.getMyReportingUsers(requestBody).subscribe(
      (response: any) => {
        this.agentCodes = response != null ? response?.data : [];
        if (this.agentCodes && this.agentCodes.length > 0) {
          this.assignLeadForm.patchValue({ selectedAgentCode: this.agentCodes[0] });
        }
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }
  assineLead() {
    const selectedLeadIDs = this.checkBoxSelectedLeads.map((lead: LeadsList) => lead.leadNumber);
    let assigneLeadRequestBody: any = {};
    assigneLeadRequestBody.leadnumber = selectedLeadIDs,
      assigneLeadRequestBody.leadassigne = this.assignLeadForm.value.selectedAgentCode,
      assigneLeadRequestBody.agentCode = this.agentCode

    this.leadsService.assineLead(assigneLeadRequestBody).subscribe(
      (response) => {
        if (response.message == "Success") {

          if (selectedLeadIDs.length > 1) {
            this.toast.success({ detail: "", summary: 'Leads has been successfully assigned.', duration: 5000 });
          } else {
            this.toast.success({ detail: "", summary: 'Lead has been successfully assigned.', duration: 5000 });
          }
          this.filterQuotes('all');
        }
      }, (error) => {
        console.error("Error: Unable to assign lead. Please try again later.", error);
      }
    );
    this.checkBoxSelectedLeads = [];
    this.assigneLeadModal.hide();
  }

  cancelAssignModal() {
    this.checkBoxSelectedLeads = [];
  }

  toggleAll(event: Event) {
    const input = event.target as HTMLInputElement;
    this.leadsList.forEach(lead => lead.isSelected = input.checked)
    this.checkBoxSelectedLeads = this.leadsList.filter(lead => lead.isSelected);
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
  getAssignedLeads() {
    this.filterLeads = false;
    this.leadsInfoListRequestBody.myleads = false;
    this.leadsInfoListRequestBody.assignedleads = true;
    this.leadsInfoListRequestBody.unassignedleads = false;
    this.getLeadsList();
    this.activeFilter = "assignedLead";
    //this.searchInputControl.reset();
  }
  getUnAssignedLeads() {
    this.filterLeads = false;
    this.leadsInfoListRequestBody.myleads = false;
    this.leadsInfoListRequestBody.assignedleads = false;
    this.leadsInfoListRequestBody.unassignedleads = true;
    this.getLeadsList();
    this.activeFilter = "unAssignedLead";
   // this.searchInputControl.reset();
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
      this.toast.warning({ detail: "", summary: 'StartDate should not be greater than today date.', duration: 5000 });
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

  redirectProducts(lead: any) {
    debugger;
    let formSequence :any;
    let proposalNumber :any ='';
    if (lead.interestedProductName ) {
   
      const reqData = {
        "agentCode": this.agentCode
      }
      this.productService.Getproductlist(reqData).subscribe({
        next: async (res: any) => {
          const ProductList = res.data;
          const interestedProductItem  = ProductList.find((product: any) => product.productName == lead.interestedProductName); 
       
          try {
            const reqData = {
              "partnerId": interestedProductItem.partnerId,
              "productId": interestedProductItem.productId
      
            }
            const res = await firstValueFrom(this.common.Getformsequence(reqData));
            formSequence = JSON.parse(res.data.formSequence);
            if (formSequence != null && formSequence.length > 0) {
              formSequence.forEach(() => { this.allJsonFormData.push({}) });
              sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonFormData));
            }
            sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
            localStorage.setItem("formIndex", "0");
          } catch (err) {
            this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
          }

          // if (lead.leadStatus.includes('Open')) {
          //   try {
          //     const response = await firstValueFrom(this.common.getProposalNumber());
          //     proposalNumber = response.data?.proposalNumber;
          //   } catch (err) {
          //     this.toast.warning({ detail: "WARNING", summary: "Failed to Generate Proposal Number", duration: 2000 });
          //   }
          // } else {
          //   proposalNumber = lead?.proposalNumber??'';
          // }

          const productData = {
            partnerId: interestedProductItem.partnerId,
            productId: interestedProductItem.productId,
            quickQuoteRedirect : true,
            leadId :  lead.leadNumber,
            proposalNum: lead?.proposalNumber??''
          }
        

            this.router.navigate(['yatra'], {
              state: { productData: productData, formSequence: formSequence }
           });
          
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.router.navigate(['/products'], {
      });
    }
  }

  restrictInput(event: KeyboardEvent): void {
    if (this.selected === 'mobileNumber' && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

}
