import { Component, HostListener } from '@angular/core';
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
import { ExcelExportService } from 'src/app/services/excel-export.service';

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent {
  
  leadsList: LeadsList[] = [];
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
    { "name": "Lost", "selected": false },
    { "name": "Lead Aged", "selected": false }
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
    private activatedRoute: ActivatedRoute,
    private excelExportService: ExcelExportService
  ) { }

  leadsInfoListRequestBody ={
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
    window.scrollTo(0, 0);

    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

    this.activatedRoute.queryParams.subscribe((params : any) => {
      let routeLeadStatus  = params['status'];
      const filter = params['filter'];
      if(routeLeadStatus && filter){
        this.leadFilterStatus.map((leadStatus:any)=>{
         if(leadStatus.name == routeLeadStatus){
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
    this.checkView(); //Screen View check
    
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
    this.leadsInfoListRequestBody.pageNumber = this.page;
    this.leadsInfoListRequestBody.pageSize = this.rows;
    this.leadsService.getLeadsListApi(this.leadsInfoListRequestBody).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.leadsList = response.data.leadList;
          console.log("Leads List", this.leadsList);
          this.countsList = response.data;
          this.totalRecords = response.data[this.filterType]; 
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
  filterQuotes(filter: string,filterRange: string) {
    this.leadsInfoListRequestBody.filterType = filter;
    this.first = 0;this.page = 1;
    this.getLeadsList();
    this.activeFilter = filter;
    this.filterType = filterRange;
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
    this.leadsInfoListRequestBody.startDate = this.startDate ;
    this.leadsInfoListRequestBody.endDate = this.endDate ;
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
      if (this.selected === "mobileNumber") {
        this.leadsInfoListRequestBody.mobileNumber = trimmedValue || "";
        this.leadsInfoListRequestBody.leadNumber = "";
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadAssigne = "";
      } else if (this.selected === "leadId") {
        this.leadsInfoListRequestBody.leadNumber = trimmedValue || "";
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadAssigne = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      } else if (this.selected === "name") {
        this.leadsInfoListRequestBody.name = trimmedValue || "";
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadNumber= "";
        this.leadsInfoListRequestBody.leadAssigne = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      }else if (this.selected === "emailID") {
        this.leadsInfoListRequestBody.email = trimmedValue || "";
        this.leadsInfoListRequestBody.name = "";
        this.leadsInfoListRequestBody.leadNumber= "";
        this.leadsInfoListRequestBody.leadAssigne = "";
        this.leadsInfoListRequestBody.mobileNumber = "";
      }else if (this.selected === "AssignedTo") {
        this.leadsInfoListRequestBody.leadAssigne = trimmedValue || "";
        this.leadsInfoListRequestBody.email = "";
        this.leadsInfoListRequestBody.leadNumber= "";
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
          this.filterQuotes('all','totalRecords');
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
    }else {
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
            if(lead.proposalNumber){
              proposalNumber = lead.proposalNumber;
            }else{
              proposalNumber = await this.generateProposalNumnberAndUpdateLeadInfor(lead.leadNumber);
            }
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
            localStorage.setItem("formIndex", lead.formSequence);
          } catch (err) {
            this.toast.warning({ detail: "WARNING", summary: "Form Configuration not found!!", duration: 2000 });
          }
          const reqData = {
            partnerId : interestedProductItem.partnerId,
            productId : interestedProductItem.productId,
            proposalNum : proposalNumber,
            agentCode : this.agentCode,
            isLead : true,
            currentFormSequence : lead.formSequence,
            leadId : lead.leadNumber
          }
          console.log(reqData);
          localStorage.setItem("formIndex", lead.formSequence.toString());
          const encodedEncryptedData = this.encryptionService.encrypt(reqData);
    
          this.router.navigate(['yatra'], {
            queryParams: { data: encodedEncryptedData }
          });
          
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.router.navigate(['/products'], {
        queryParams: { leadnumber:lead.leadNumber },
      });
    }
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
    }else {
      this.selectedView = 'list'; // Use 'grid' view for desktop
    }
  }


  async generateProposalNumnberAndUpdateLeadInfor(leadNumber : any) {
    try {
      const proposalGenerateResponse = await firstValueFrom(this.common.getProposalNumber());
      let proposalNumber = proposalGenerateResponse.data?.proposalNumber;
      const response = await firstValueFrom(this.leadsService.getLeadInformationByLeadID(leadNumber));
      const leadInformation = response?.data?.leadList[0];
      leadInformation.proposalNumber = proposalNumber;
      leadInformation.isUpdate = 1;
      this.leadsService.saveLeadData(leadInformation).subscribe(
        (response) => {
          console.log("Lead has been Successfully Updated", response);
        }, (error) => {
          console.log("Failed to update Lead Infomation", error);
        });
      return proposalNumber;
    }
    catch (error) {
      console.log("Failed to fetch lead Information!", error)
      return 0;
    }

  }

  downloadSingleItem(item: any): void {
    this.excelExportService.exportToExcel([item], `Lead_${item.leadNumber}`);
  }

  maskEmail(email: any): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }
  
  maskMobileNumber(mobileNumber: any): string {
    return mobileNumber.slice(0, 2) + '*'.repeat(mobileNumber.length - 4) + mobileNumber.slice(-2);
  }

  downloadAllLeads(){
    this.leadsService.downloadAllLeads(this.leadsInfoListRequestBody).subscribe(
     (response)=>{
     debugger;
     if(response.isSuccess){
      //this.downloadExcel(  response.fileContentBase64 ,    response.fileName);
      const blob = this.base64ToBlob(response?.data?.fileContentBase64,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response?.data?.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.toast.success({ detail: "", summary: 'Commission Statement Downloaded Successfully.', duration: 2000 }); 

     }
     },
     (error)=>{
      console.log('Exception',error);
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
  
}
