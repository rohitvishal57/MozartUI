import { Component } from '@angular/core';
import { LeadsList } from '../leads-list.interface';
import { FormControl, Validators } from '@angular/forms';
import { LeadsService } from '../leads.service';
import { CommonService } from 'src/app/services/common.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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
  selected: string = "leadId";
  searchInputControl = new FormControl("", Validators.required);
  isDesktopView: boolean = false;
  agentCode = localStorage.getItem('agentCode');
  placeholder: string = '';
  displayAssigneePopup = false;
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
  constructor(
    private leadsService: LeadsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  leadsLisRequestBody = {
    "agentCode": this.agentCode,
    "leadNumber": "",
    "productName": "",
    "startDate": null,
    "pageNumber": 1,
    "pageSize": 10,
    "name": "",
    "email": "",
    "mobileNumber": "",
    "filterType": ""
  }

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
    "isSellerPortal": true
  }




  ngOnInit(): void {
    const storedAgentCode = localStorage.getItem('agentCode');
    if (storedAgentCode) {
      this.leadsLisRequestBody.agentCode = storedAgentCode;
      this.getLeadsList();
    }
    else {
      console.log("agent code is not present in local storege");
    }
    this.getProducts();
    this.fetchReportingUsers();
    this.assignLeadForm = this.fb.group({
      selectedAgentCode: ['']
    });
    this.updateStatusForm = this.fb.group({
      leadStatus: [''],
      leadSubStatus: ['']
    })
    this.addNoteForm = this.fb.group({
      title: [''],
      activityStartDate: [''],
      activityStartTime: [''],
      activityEndDate: [''],
      activityEndTime: [''],
      activityType: [''],
      notes: [''],
    });
    this.markDuplicateForm = this.fb.group({
      leadId: ['']
    });

    let fetchActivityTypeRequest: any = {};
    this.leadsService.fetchActivityType(fetchActivityTypeRequest).subscribe(
      (response) => {
        console.log("ActivityType information : " + response.activityName);
        this.activityTypes = response.activityName;
      },
      (error) => {

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
          this.leadsList = response.leadList,
            console.log("Renewal List", this.leadsList);
          this.countsList = response;
          this.totalRecords = this.countsList.totalCount;
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  editLead(leadNumber: any) {
    this.router.navigate(['/leads/updateLead/' + leadNumber]);
  }
  updateStatus(leadNumber: any) {
    this.statusUpdateLead = leadNumber;
    this.leadsService.getReferenceStatus().subscribe(
      (response) => {
        console.log(response);
        this.displayUpdateStatusPopup = true
        this.referenceStatus = response;
        // this.referenceSubStatus = response;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }
  changeReferStatus(event: any) {
    console.log(event.target.value);
    let selectedStatus = event.target.value
    this.referenceSubStatus = this.referenceStatus.find((status: any) => status.name === selectedStatus);
    console.log(this.referenceSubStatus);
  }
  updateStatusSubmit() {
    console.log(this.updateStatusForm.value);
    let reqObj = {
      agentcode: this.agentCode,
      statusMessage: "Approval",
      statusCode: "334",
      sessionId: "8",
      response: "ok",
      leadnumber: this.statusUpdateLead,
      status: this.updateStatusForm.get('leadStatus')?.value,
      substatus: this.updateStatusForm.get('leadSubStatus')?.value
    }
    this.leadsService.updateStatus(reqObj).subscribe(
      (response) => {
        console.log(response);
        this.displayUpdateStatusPopup = false;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
        this.displayUpdateStatusPopup = false;
      }
    );
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
    this.leadsInfoListRequestBody.searchby="";
    this.leadsInfoListRequestBody.myleads = true;
    this.leadsInfoListRequestBody.assignedleads = true;
    this.leadsInfoListRequestBody.unassignedleads = true;
    this.leadsLisRequestBody.filterType = filter;

    this.getLeadsList();
    this.activeFilter = filter;
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
    })
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
    this.calculateAppliedFiltersCount();
    const selectedProducts = this.productsList
      .filter((product) => product.selected)
      .map((product) => product.productName);
    console.log("selectedProducts", selectedProducts);
    this.leadsLisRequestBody.productName = selectedProducts.join(", ");
    console.log("product names which are taking by request body", this.leadsLisRequestBody.productName);
    this.getLeadsList();
    this.toggeledropdown = false;
  }
  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.appliedFiltersCount = 0;
    this.leadsLisRequestBody.productName = "";
    this.toggeledropdown = false;
    this.getLeadsList();
  }
  clear() {
    this.productsList.forEach((product) => (product.selected = false));
    this.appliedFiltersCount = 0;
    this.leadsLisRequestBody.productName = "";
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
    } else if (this.selected = '') {
      this.placeholder = '';
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
  cancelSearch(menuTrigger: MatMenuTrigger) {
    this.toggeleSearchdropdown = false;
    this.selected = "";
    this.leadsLisRequestBody.mobileNumber = "";
    this.leadsLisRequestBody.name = "";
    this.leadsLisRequestBody.email = "";
    this.leadsLisRequestBody.leadNumber = "";
    this.searchInputControl.reset();
    this.getLeadsList();
    menuTrigger.closeMenu();
  }
  applySearch() {
    if (this.searchInputControl.valid) {
      this.leadsInfoListRequestBody.searchby=this.searchInputControl.value!;
    }else{
      this.leadsInfoListRequestBody.searchby = "";
    }
    this.getLeadsList();
  }
  renewalListView(view: string) {
    this.selectedView = view;
  }

  showAssigneLeadDialog(leadInformation: any) {

    if (!this.checkBoxSelectedLeads.some((lead: any) => lead.leadNumber === leadInformation.leadNumber)) {
      this.checkBoxSelectedLeads.push(leadInformation);
    }

    this.displayAssigneePopup = true;
  }

  showNotesDialog(leadInformation: any) {
    this.selectedleadInformation = leadInformation;
    this.displayNotesPopup = true;
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
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
    console.log("fetchReportingUsers agentCodes", this.agentCodes)
  }

  assineLead() {
    const selectedLeadIDs = this.checkBoxSelectedLeads.map((lead: LeadsList) => lead.leadNumber);
    console.log("selectedLeadIDs", selectedLeadIDs)
    let assigneLeadRequestBody: any = {};
    assigneLeadRequestBody.leadnumber = selectedLeadIDs,
      assigneLeadRequestBody.leadassigne = this.assignLeadForm.value.selectedAgentCode,
      assigneLeadRequestBody.agentCode = this.agentCode
    this.leadsService.assineLead(assigneLeadRequestBody).subscribe(
      (response) => {
        if (response.errorMessage == "success") {
          console.log("Success! The lead has been successfully assigned!");
        }
      }, (error) => {
        console.error("Error: Unable to assign lead. Please try again later.", error);
      }
    );
    this.displayAssigneePopup = false;
  }

  addNotes() {
    let addNotesRequestBody: any = {};
    addNotesRequestBody.activitystartdate = this.addNoteForm.value.activityStartDate,
      addNotesRequestBody.activityenddate = this.addNoteForm.value.activityEndDate,
      addNotesRequestBody.activityName = this.addNoteForm.value.title,
      addNotesRequestBody.note = this.addNoteForm.value.notes,
      addNotesRequestBody.name = this.addNoteForm.value.notes,
      addNotesRequestBody.activitytype = this.addNoteForm.value.activityType,
      addNotesRequestBody.agentcode = this.agentCode,
      addNotesRequestBody.createdat = new Date(),
      addNotesRequestBody.mobilenumber = this.selectedleadInformation.phoneNumber,
      addNotesRequestBody.leadnumber = this.selectedleadInformation.leadNumber,
      addNotesRequestBody.isupdate = 0

    this.leadsService.addLeadNotes(addNotesRequestBody).subscribe(
      (response) => {
        if (response.errorMessage == "success") {
          console.log("Add addLeadNotes success");
        }
      }, (error) => {
        console.error("Error from addLeadNotes API:", error);
      }
    );
    this.displayNotesPopup = false;
  }

  toggleAll(event: Event) {
    const input = event.target as HTMLInputElement;
    this.leadsList.forEach(lead => lead.isSelected = input.checked)
    this.checkBoxSelectedLeads = this.leadsList.filter(lead => lead.isSelected);
    console.log("checkBoxSelectedLeads", this.checkBoxSelectedLeads.length)

  }



  updateSelectedLeads(leadInfo: any) {
    if (this.checkBoxSelectedLeads.some((lead: any) => lead.leadNumber === leadInfo.leadNumber)) {
      this.checkBoxSelectedLeads = this.checkBoxSelectedLeads.filter((lead: any) => lead.leadNumber !== leadInfo.leadNumber);
    } else {
      this.checkBoxSelectedLeads.push(leadInfo);
    }
    console.log("checkBoxSelectedLeads", this.checkBoxSelectedLeads)
    console.log("checkBoxSelectedLeads", this.checkBoxSelectedLeads.length)
  }


  selectAllAssigneLeadDialog() {
    this.showAssigneLeadDialog(this.selectedleadInformation);
  }


  getAssignedLeads() {
    this.leadsInfoListRequestBody.searchby="";
    this.leadsInfoListRequestBody.myleads = false;
    this.leadsInfoListRequestBody.assignedleads = true;
    this.leadsInfoListRequestBody.unassignedleads = false;
    this.getLeadsList();
    this.activeFilter = "assignedLead";

  }

  getUnAssignedLeads() {
    this.leadsInfoListRequestBody.searchby="";
    this.leadsInfoListRequestBody.myleads = false;
    this.leadsInfoListRequestBody.assignedleads = false;
    this.leadsInfoListRequestBody.unassignedleads = true;
    this.getLeadsList();
    this.activeFilter = "unAssignedLead";

  }

  getPlaceholder(): string {
    debugger
    if (this.selected === 'leadId') {
        return 'Enter Lead Number';
      } else if (this.selected === 'mobileNumber') {
        return 'Enter mobileNumber';
      } else if (this.selected === 'name') {
        return 'Enter Name';
      }else if (this.selected == 'email'){
        return 'Enter EmailId';
      }
    else {
        return 'Search...';
      }
    } 
}
