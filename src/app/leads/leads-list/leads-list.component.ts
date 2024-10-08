import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { LeadsList } from 'src/app/interface/leads-list.interface';
import { CommonService } from 'src/app/services/common.service';
import { LeadsService } from '../leads.service';

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent {

  leadsList:LeadsList[] = [];
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
  searchInputControl = new FormControl("",Validators.required);
  isDesktopView:boolean=false;
  agentCode=localStorage.getItem('agentCode');


  constructor(
    private leadsService: LeadsService,
    private commonService:CommonService
  ) {}

  leadsLisRequestBody={
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
    this.getLeadsList()
    this.getProducts();
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
          console.log("Renewal List",this.leadsList);
          this.countsList = response.data;
          this.totalRecords = this.countsList.totalRecords;
        } 
        else {console.error("API request was not successful.");}
      },
      (error) => {
        console.error("Error from getRenewalsList API:", error);
      }
    );
  }
  filterQuotes(filter: string) {
    this.leadsLisRequestBody.filterType = filter;
    this.getLeadsList();
    this.activeFilter = filter;
  }
  getProducts() {
    const reqData={
      "agentCode": this.agentCode
    }
    this.commonService.Getproductlist(reqData).subscribe({
      next: (res) => {
        this.productsList = res.data;
        console.log("product list",this.productsList)
      },
      error: (err) => {
         console.log("error coming form getproduct list API");
      }
    })
  }
  toggleFilterDropdown() {
    if(this.toggeleSearchdropdown==true)
    {
       this.toggeleSearchdropdown=false;
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
      console.log("selectedProducts",selectedProducts);     
    this.leadsLisRequestBody.productName = selectedProducts.join(", ");
     console.log("product names which are taking by request body",this.leadsLisRequestBody.productName);  
    this.getLeadsList();
    this.toggeledropdown=false;
  }
  cancel() {
    this.productsList.forEach((product) => (product.selected = false));
    this.appliedFiltersCount = 0;
    this.leadsLisRequestBody.productName = "";
    this.toggeledropdown = false;
    this.getLeadsList();
  }
  clear(){
    this.productsList.forEach((product) => (product.selected = false));
    this.appliedFiltersCount = 0;
    this.leadsLisRequestBody.productName = "";
    this.getLeadsList();
  }
  toggleSearchDropdown() {
    if(this.toggeledropdown==true)
    {
      this.toggeledropdown=false;
    }
    this.toggeleSearchdropdown = !this.toggeleSearchdropdown;
  }
  onSelectChanges(event: any): void {
    this.searchInputControl.setValue("");
    this.searchInputControl.clearValidators();
    if (this.selected === "mobileNumber") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[6-9][0-9]{9}$")
      ]);
    } 
    else if (this.selected === "name") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9@#$%^&*! ]*$")
      ]);
    }
    else if (this.selected === "email") {
      this.searchInputControl.setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$")
      ]);
    } 
    else if (this.selected === "leadId") {
      this.searchInputControl.setValidators([
        Validators.required
      ]);
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

}