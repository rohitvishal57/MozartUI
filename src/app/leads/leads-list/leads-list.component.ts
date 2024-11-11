import { Component } from '@angular/core';
import { LeadsList } from '../leads-list.interface';
import { FormControl, Validators } from '@angular/forms';
import { LeadsService } from '../leads.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { NgToastService } from 'ng-angular-popup';
import { ProductsService } from 'src/app/product/products/products.service';
import { firstValueFrom } from 'rxjs';
import { EncryptionService } from 'src/app/services/encryption.service';
declare var bootstrap: any;

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
  selected: string = "Select an option";
  searchInputControl = new FormControl("", Validators.required);
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
  referenceStatus: any;
  referenceSubStatus: any;
  statusUpdateLead: any;
  startDate: any;
  endDate: any;
  todayDate : any = new Date().toISOString().split('T')[0];
  filterLeads = false;
  today: string = '';
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  formSequence: any[] = [];
  private allJsonFormData: any[] = [];
  formData: any = {};
  filterFeildType = 'text';
  filterFeildmaxlength = 10;
  interestedProductName : string ='';
  interestedProductItem : any = '';
  ProductList :any = [];
  constructor(
    private leadsService: LeadsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private toast: NgToastService,
    private productService: ProductsService,
    private common: CommonService,
    private encryptionService: EncryptionService
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
    "isSellerPortal": true

  }

  ngOnInit(): void {
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
          // this.appliedFiltersCount = 0;
          // if (this.filterLeads == true) {
          //  this.appliedFiltersCount = response.data.totalCount;
          //}
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
    this.leadsInfoListRequestBody.searchby = "";
    this.leadsInfoListRequestBody.fromdate = null;
    this.leadsInfoListRequestBody.todate = null;
    this.leadsInfoListRequestBody.searchlist = "";
    this.leadsInfoListRequestBody.myleads = true;
    this.leadsInfoListRequestBody.assignedleads = true;
    this.leadsInfoListRequestBody.unassignedleads = true;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = "";
    this.endDate = "";
    this.filterLeads = false;
    this.getLeadsList();
    this.activeFilter = filter;
    this.searchInputControl.reset();
    this.selected = "Select an option";
    this.getPlaceholder();
  }
  getProducts() {
    const reqData = {
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
        console.log("product list", this.productsList)
      },
      error: (err) => {
        console.log("error coming form getproduct list API");
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
    const selectedProductsCount = this.productsList.filter(
      (product) => product.selected).length;

    const selectedpolicyTypeCount = this.StaticPolicyTypes.filter(
      (policyType) => policyType.selected).length;

    let count = selectedProductsCount + selectedpolicyTypeCount;

    if (this.startDate && this.endDate) {
      count++;
    }

    this.appliedFiltersCount = count || 0;
  }

  applyFilter() {
    this.filterLeads = true;
    this.calculateAppliedFiltersCount();
    const selectedProducts = this.productsList.filter((product) => product.selected)
      .map((product) => product.productName);
    const selectedPolicyTypes = this.StaticPolicyTypes.filter((policyType) => policyType.selected)
      .map((policyType) => policyType.name);
    this.leadsInfoListRequestBody.searchlist = selectedProducts.join(", ");
    this.leadsInfoListRequestBody.policyList = selectedPolicyTypes.join(", ");

    this.leadsInfoListRequestBody.fromdate = this.startDate || null;
    this.leadsInfoListRequestBody.todate = this.endDate || null;
    this.getLeadsList();
    this.toggeledropdown = false;
    this.selected = "Select an option";
    //this.searchInputControl.reset();

  }
  cancel() {
    this.filterLeads = false;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
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
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();
    if (this.selected === "mobileNumber") {
      this.placeholder = 'Mobile Number';
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[6-9][0-9]{9}$")
      ]);
    }
    else if (this.selected === "name") {
      this.placeholder = 'Proposer Name';
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[A-Za-zÀ-ÿ ]+$")
      ]);
    }
    else if (this.selected === "email") {
      this.placeholder = 'Email';
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$")
      ]);
    }
    else if (this.selected === "leadId") {
      this.placeholder = 'Lead Id';
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[A-Za-z]{3}\\d{12}$")
      ]);
    }
    else if (this.selected = 'Select an option') {
      this.placeholder = 'Search...';
      this.leadsInfoListRequestBody.searchby = '';
      this.getLeadsList();
    }
    this.searchInputControl.updateValueAndValidity();
    this.getPlaceholder();
  }


  applySearch() {
    console.log('this.searchInputControl', this.searchInputControl.errors)
    if (this.searchInputControl.errors) {
      this.getSearchInputControlPatternMessage();
    }
    if (this.searchInputControl.valid) {
      this.leadsInfoListRequestBody.searchby = this.searchInputControl.value?.trim() || '';
    } else {
      this.leadsInfoListRequestBody.searchby = "";
    }
    if (this.selected != 'Select an option') {
      this.getLeadsList();
      this.activeFilter = this.leadsList.length > 0 && this.leadsList[0].isAssign ? 'assignedLead' : 'unAssignedLead';
    }
    this.searchInputControl.reset();
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
    this.leadsInfoListRequestBody.searchby = "";
    this.leadsInfoListRequestBody.fromdate = null;
    this.leadsInfoListRequestBody.todate = null;
    this.leadsInfoListRequestBody.searchlist = "";
    this.leadsInfoListRequestBody.myleads = false;
    this.leadsInfoListRequestBody.assignedleads = true;
    this.leadsInfoListRequestBody.unassignedleads = false;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = "";
    this.endDate = "";
    this.filterLeads = false;
    this.getLeadsList();
    this.activeFilter = "assignedLead";
    this.selected = "Select an option";
    this.searchInputControl.reset();
  }
  getUnAssignedLeads() {
    this.leadsInfoListRequestBody.searchby = "";
    this.leadsInfoListRequestBody.fromdate = null;
    this.leadsInfoListRequestBody.todate = null;
    this.leadsInfoListRequestBody.searchlist = "";
    this.leadsInfoListRequestBody.myleads = false;
    this.leadsInfoListRequestBody.assignedleads = false;
    this.leadsInfoListRequestBody.unassignedleads = true;
    this.productsList.forEach((product) => (product.selected = false));
    this.StaticPolicyTypes.forEach((policyType) => (policyType.selected = false));
    this.startDate = "";
    this.endDate = "";
    this.filterLeads = false;
    this.getLeadsList();
    this.activeFilter = "unAssignedLead";
    this.selected = "Select an option";
    this.searchInputControl.reset();
  }
  getPlaceholder(): string {
    this.filterFeildType = "text";
    this.filterFeildmaxlength = 50;
    if (this.selected === 'leadId') {
      this.filterFeildmaxlength = 20;
      return 'Enter Lead ID';
    } else if (this.selected === 'mobileNumber') {
      this.filterFeildType = "number";
      this.filterFeildmaxlength = 10;
      return 'Enter Mobile Number';
    } else if (this.selected === 'name') {
      return 'Enter Name';
    } else if (this.selected == 'email') {
      return 'Enter Email ID';
    }
    else {
      return 'Search...';
    }
  }


  getSearchInputControlPatternMessage() {
    let errorMessage: string = '';
    if (this.searchInputControl.hasError('required')) {
      errorMessage = 'This field is required.';
    }
    if (this.selected === 'leadId') {
      errorMessage = 'Lead ID should contain only alphanumeric characters (A-Z, 0-9).';
    } else if (this.selected === 'mobileNumber') {
      errorMessage = 'Mobile Number should be exactly 10 digits.';
    } else if (this.selected === 'name') {
      errorMessage = 'Name should contain only letters and spaces.';
    } else if (this.selected === 'email') {
      errorMessage = 'Please enter a valid email address (e.g., user@example.com).';
    }
    return this.toast.warning({ detail: "", summary: errorMessage, duration: 5000 });

  }

  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
   

    if (this.startDate > new Date().toISOString().split('T')[0]) {
      this.startDate = ''; // Clear the invalid date
      this.toast.warning({ detail: "", summary: 'StartDate should not be greater than today date.', duration: 5000 });
    }

  }

  formatCreatedOn(dateString: string | null | undefined) {
    if (!dateString) {
      return 'N/A'; // Handle null or undefined values
    }
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    return formattedDate || 'Invalid Date'; // Handle invalid date
  }

  redirectProducts(lead: any) {
    if (lead.interestedProductName ) {
   
      const reqData = {
        "agentCode": this.agentCode
      }
      this.productService.Getproductlist(reqData).subscribe({
        next: async (res: any) => {
           const ProductList = res.data;
          console.log('this.ProductList',ProductList)
       
          const interestedProductItem  = ProductList.find((product: any) => product.productName == lead.interestedProductName); 
       
          try {
           // sessionStorage.clear();
            const reqData = {
              "partnerId": interestedProductItem.partnerId,
              "productId": interestedProductItem.productId
      
            }
            console.log(reqData);
            const res = await firstValueFrom(this.common.Getformsequence(reqData));
            console.log(res);
            this.formSequence = JSON.parse(res.data.formSequence);
            console.log(this.formSequence);
      
            if (this.formSequence != null && this.formSequence.length > 0) {
              this.formSequence.forEach(() => { this.allJsonFormData.push({}) });
              sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonFormData));
            }
            console.log(this.allJsonFormData);
            sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
            localStorage.setItem("formIndex", "0");
          } catch (err) {
            this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
          }
          const productData = {
            partnerId: interestedProductItem.partnerId,
            productId: interestedProductItem.productId,
            quickQuoteRedirect : true
    
          }

            this.router.navigate(['yatra'], {
              state: { productData: productData, formSequence: this.formSequence }
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

}
