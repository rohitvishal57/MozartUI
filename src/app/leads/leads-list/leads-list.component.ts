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
  selected: string = "";
  searchInputControl = new FormControl("", Validators.required);
  isDesktopView: boolean = false;
  agentCode = localStorage.getItem('agentCode');
  placeholder: string = '';
  displayAssigneePopup = false;
  agentCodes: any = [];
  assignLeadForm!: FormGroup;
  selectedLeadAssignee: string = '';
  selectedLeadNumbers: string[] = [];
  selectedleadInformation: any;
  displayNotesPopup = false;
  activityTypes = ['sbhn', 'PORTABILITY', 'fresh policy'];
  addNoteForm!: FormGroup;
  mobileNumber : string = '';

  constructor(
    private leadsService: LeadsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  leadsLisRequestBody = {
    "agentCode": this.agentCode,
    "leadId": "",
    "productName": "",
    "startDate": null,
    "pageNumber": 1,
    "pageSize": 10,
    "name": "",
    "email": "",
    "mobileNumber": "",
    "filterType": ""
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

    this.addNoteForm = this.fb.group({
      title: [''],
      activityStartDate: [''],
      activityStartTime: [''],
      activityEndDate: [''],
      activityEndTime: [''],
      activityType: [''],
      notes: [''],
    });
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getLeadsList();
  }
  getLeadsList() {
    
    this.leadsLisRequestBody.pageNumber = this.page;
    this.leadsLisRequestBody.pageSize = this.rows;
    this.leadsService.getLeadsListApi(this.leadsLisRequestBody).subscribe(
      (response) => {
        console.log(response.data);
        if (response.success) {
          this.leadsList = response.data.leadList,
            console.log("Renewal List", this.leadsList);
          this.countsList = response.data;
          this.totalRecords = this.countsList.totalRecords;
        }
        else { console.error("API request was not successful."); }
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  editLead(leadData: any){
    console.log(leadData);
    localStorage.removeItem('updateLead')
    localStorage.setItem('updateLead', JSON.stringify(leadData))

    this.router.navigate(['/leads/updateLead/' + leadData.leadNumber]); 
    

  }
  filterQuotes(filter: string) {
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
    this.leadsLisRequestBody.leadId = "";
    this.searchInputControl.reset();
    this.getLeadsList();
    menuTrigger.closeMenu();
  }
  applySearch(menuTrigger: MatMenuTrigger) {
    if (this.searchInputControl.valid) {
      if (this.selected === "mobileNumber") {
        this.leadsLisRequestBody.mobileNumber = this.searchInputControl.value!;
        this.leadsLisRequestBody.name = "";
        this.leadsLisRequestBody.email = "";
        this.leadsLisRequestBody.leadId = "";
      }
      else if (this.selected === "name") {
        this.leadsLisRequestBody.name = this.searchInputControl.value!;
        this.leadsLisRequestBody.mobileNumber = "";
        this.leadsLisRequestBody.email = "";
        this.leadsLisRequestBody.leadId = "";
      }
      else if (this.selected === "email") {
        this.leadsLisRequestBody.email = this.searchInputControl.value!;
        this.leadsLisRequestBody.mobileNumber = "";
        this.leadsLisRequestBody.name = "";
        this.leadsLisRequestBody.leadId = "";
      }
      else if (this.selected === "leadId") {
        this.leadsLisRequestBody.leadId = this.searchInputControl.value!;
        this.leadsLisRequestBody.mobileNumber = "";
        this.leadsLisRequestBody.name = "";
        this.leadsLisRequestBody.email = "";
      }
      this.getLeadsList();
      menuTrigger.closeMenu();
    }
  }
  renewalListView(view: string) {
    this.selectedView = view;
  }


  showDialog(leadInformation: any) {
    this.selectedleadInformation = leadInformation; 
    this.displayAssigneePopup = true;
  }


  showNotesDialog(leadInformation: any) {
    this.selectedleadInformation = leadInformation;
    this.displayNotesPopup = true;
  }

  updateLeadInfoRoute(leadInformation: any) {
    this.router.navigate(['/leads/createLead/'], { state: { leadInformation } }); // Pass state here
  }

  fetchReportingUsers() {
    const requestBody = {
      parentCode: "2102267"
    };
    this.leadsService.getMyReportingUsers(requestBody).subscribe(
      (response) => {
        this.agentCodes = response;
      },
      (error) => {
        console.error("Error from getMyReportingUsers API:", error);
      }
    );
  }

  assineLead() {
    const leadId = [this.selectedleadInformation.leadId];

    const requestBody = {
      leadnumber : leadId,
      leadassigne: this.assignLeadForm.get('selectedAgentCode')?.value,
      agentcode: this.agentCode
    };

    console.log("request body for assigne:" + JSON.stringify(requestBody))
    this.leadsService.assineLead(requestBody).subscribe(
      (response) => {
        if (response.errorMessage == "success") {
          console.error("Lead Success Assined");
        }
      }, (error) => {
        console.error("Error from assineLead API:", error);
      }
    );
    this.displayAssigneePopup = false;
  }


  addNotes() {
    console.log("Values xnjf", this.addNoteForm.value)
    const addNotesRequestBody = {
      activitystartdate: this.addNoteForm.value.activityStartDate,
      activityenddate: this.addNoteForm.value.activityEndDate,
      activityName: this.addNoteForm.value.title,
      note: this.addNoteForm.value.note,
      mobilenumber: this.selectedleadInformation.phoneNumber,
      agentcode: this.agentCode,
      createdat: new Date() ,
      name: this.addNoteForm.value.note,
      leadnumber: this.selectedleadInformation.leadId,
      activitytype: this.addNoteForm.value.activityType,
      isupdate: 0
    };

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

}
