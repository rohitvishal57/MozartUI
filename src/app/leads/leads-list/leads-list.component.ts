import { Component } from '@angular/core';
import { LeadsList } from '../leads-list.interface';
import { FormControl, Validators } from '@angular/forms';
import { LeadsService } from '../leads.service';
import { CommonService } from 'src/app/services/common.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { NgToastService } from 'ng-angular-popup';
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
  filterLeads = false;
  today : String = '';
  StaticPolicyTypes = [
    { name: 'Individual', selected: false },
    { name: 'Family Floater', selected: false },
  ];
  constructor(
    private leadsService: LeadsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private toast: NgToastService

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

    const date = new Date();
    this.today = date.toISOString().split('T')[0];
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
        if (response.statusCode == 200) {
          this.leadsList = response.leadList;
          console.log("Renewal List", this.leadsList);
          this.countsList = response;
          this.totalRecords = this.countsList.totalCount;
          this.appliedFiltersCount =0;
          if (this.filterLeads == true) {
            this.appliedFiltersCount = response.totalCount;
          }
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
  }
  getProducts() {
    const reqData = {
      //"agentCode": this.agentCode
      "agentCode": '4620973'
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
    this.appliedFiltersCount = selectedProductsCount;
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
    this.leadsInfoListRequestBody.fromdate = this.startDate;
    this.leadsInfoListRequestBody.todate = this.endDate;
    this.getLeadsList();
    this.toggeledropdown = false;

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
    debugger
    this.getLeadsList();
  }
  clear() {
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
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$")
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
        Validators.required
      ]);
    }
     else if (this.selected = 'Select an option') {
      this.placeholder = 'Search...';
      this.leadsInfoListRequestBody.searchby='';
      this.getLeadsList();
    }
    this.searchInputControl.updateValueAndValidity();
    this.getPlaceholder();
  }

  getErrorMessage(): string {
    if (this.searchInputControl.hasError("required")) {
      return "This field is required";
    }
    else if (this.searchInputControl.hasError("pattern")) {
      if (this.selected === "mobileNumber") {
        return "Invalid Mobile Number";
      }
      else if (this.selected === "name") {
        return "Invalid Name";
      }
      else if (this.selected === "email") {
        return "Invalid Email";
      }
    }
    return "";
  }
  applySearch() {
    if (this.searchInputControl.valid) {
      this.leadsInfoListRequestBody.searchby = this.searchInputControl.value?.trim() || '';
    } else {
      this.leadsInfoListRequestBody.searchby = "";
    }
    debugger;
    if(this.selected!='Select an option'){
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
      (response) => {
        this.agentCodes = response;
        if (this.agentCodes.length > 0) {
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
        if (response.message  == "Success") {

          if(selectedLeadIDs.length>1){
            this.toast.success({ detail: 'Leads has been successfully assigned' });
          }else{
            this.toast.success({ detail: 'Lead has been successfully assigned' });
          }
        }
      }, (error) => {
        console.error("Error: Unable to assign lead. Please try again later.", error);
      }
    );
    this.checkBoxSelectedLeads ='';
    this.assigneLeadModal.hide();
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
  }
  getPlaceholder(): string {
    if (this.selected === 'leadId') {
      return 'Enter Lead Number';
    } else if (this.selected === 'mobileNumber') {
      return 'Enter mobileNumber';
    } else if (this.selected === 'name') {
      return 'Enter Name';
    } else if (this.selected == 'email') {
      return 'Enter EmailId';
    }
    else {
      return 'Search...';
    }
  }
  formatDate(dateType: "startDate" | "endDate") {
    if (dateType === "startDate" && this.startDate) {
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    } else if (dateType === "endDate" && this.endDate) {
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    }
  }


}
