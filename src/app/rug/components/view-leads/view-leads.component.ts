import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RugService } from '../../rug.service';
import { AdminService } from '../../Admin/admin.service';
import { AuditpopupComponent } from '../auditpopup/auditpopup.component';
// import { ApiService } from 'src/app/core/services/api.service';
// import { AuditPopupComponent } from 'src/app/shared/components/audit-popup/audit-popup.component';
// import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
// import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-leads',
  templateUrl: './view-leads.component.html',
  styleUrls: ['./view-leads.component.scss']
})

export class ViewLeadsComponent implements OnInit {
  loginData: any
  localStorageData: any;
  reqBody: any;
  leadsArray: any;
  filteredArray: any;
  viewLeadForm!: FormGroup;
  loading = false;
  agentCode: any;
  searchInputControl = new FormControl("");
  constructor(
    private router: Router,
    private dialog: MatDialog,
    // private apiService: ApiService,
    private formBuilder: FormBuilder,
    private rugService: RugService,
    private adminService: AdminService,
    private matdialogue: MatDialog
  ) { }
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  totalRecords: number = 0;
  viewClaims: boolean = false;
  selected: string = '';
  isDesktopView: boolean = false;
  selectedView: string = "list";
  allLeads: any[] = [];
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  displayedAVs: any[] = [];
  mobileNumber: string = ""
  leadId: string = '';
  ngOnInit(): void {
    this.viewLeadForm = this.formBuilder.group({
      mobileNumber: [''],
      leadId: [''],
    });

    this.getAllLeads();
  }
  getAllLeads() {
    // const endpoint='/TeleSales/GetLeads?pageNo=1&noOfRow=10'
    // if (localStorage.getItem("currentUser") !== null) {
    this.agentCode = localStorage.getItem("agentCode");
    // this.loginData = JSON.parse(this.localStorageData);

    const filters = {
      MobileNumber: [this.viewLeadForm.controls['mobileNumber'].value?.toString()].filter(value => value),
      LeadId: [this.viewLeadForm.controls['leadId'].value?.toString()].filter(value => value),
    };

    this.reqBody = {
      userId: this.agentCode,
      isSoloJourney: false,
      isUnverifiedLead: false,
      isDualJourney: false,
      isViewLead: true,
      isViewCheckerLead: false,
      pageNumber: this.page,
      pageSize: this.rows,
      filters: filters,
    }
    this.loading = true;
    this.rugService.getAllLeads(this.reqBody).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data);
        this.allLeads = res.data.leadDetails;
        console.log(res);
        this.totalRecords = this.searchTerm ? this.allLeads.length : res.data.totalRecords;
   
        this.displayedAVs = [...this.allLeads];
        console.log(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onPageChange(event: any): void {
    if (!this.searchTerm) {
      this.first = event.first;
      this.rows = event.rows;
      this.page = Math.floor(this.first / this.rows) + 1;
      this.getAllLeads();
    }
  }
  searchLeads(): void {
    this.getAllLeads();
  }

  onInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.displayedAVs = this.allLeads.filter((option: any) =>
      option?.leadId?.toLowerCase().includes(this.searchTerm) ||
      option?.proposalNo?.toLowerCase().includes(this.searchTerm) ||
      option?.customerName?.toLowerCase().includes(this.searchTerm) ||
      option?.leadGenerationDate?.toLowerCase().includes(this.searchTerm) ||
      option?.latestModifiedDateTime?.toLowerCase().includes(this.searchTerm) ||
      option?.latestMappedDOName?.toLowerCase().includes(this.searchTerm) ||
      option?.latestMappedAVName?.toLowerCase().includes(this.searchTerm) ||
      option?.planName?.toLowerCase().includes(this.searchTerm) ||
      option?.netPremium?.toLowerCase().includes(this.searchTerm) ||
      option?.axisCenter?.toLowerCase().includes(this.searchTerm) ||
      option?.axisLob?.toLowerCase().includes(this.searchTerm) ||
      option?.disposition?.toLowerCase().includes(this.searchTerm) ||
      option?.subDisposition?.toLowerCase().includes(this.searchTerm) ||
      option?.status?.toLowerCase().includes(this.searchTerm) ||
      option?.policyIssuanceDate?.toLowerCase().includes(this.searchTerm) ||
      option?.remark?.toLowerCase().includes(this.searchTerm)
    );
  }
  applySearch() {
    if (this.searchInputControl.valid) {
      const trimmedValue = this.searchInputControl.value?.trim();
      // if (this.selected === "leadId") {
      //     this.leadsInfoListRequestBody.leadNumber = trimmedValue || "";
      // }
      this.first = 0;
      this.page = 1;
      this.getAllLeads();
    }
  }

  actionLead(lead: any) {
    console.log(lead);
    localStorage.setItem('leadId', lead.leadId)
    let data = {
      partnerId: lead.partnerId,
      productId: lead.productId
    }

    // if (lead.planName == 'Health Pro') {
    //   data.partnerId = 45
    //   data.productId = 26

    // } else if (lead.planName == 'Health Pro Infinity') {
    //   data.partnerId = 45
    //   data.productId = 27
    // } else if (lead.planName == 'Group Activ Secure') {
    //   data.partnerId = 45
    //   data.productId = 29
    // } else {
    //   data.partnerId = 45
    //   data.productId = 29
    // }

    this.router.navigate(['rug'], {
      state: { productData: data }
    });
    // let ecrytpedLeadID = this.apiService.encryptUrlData(lead.leadId);
    // let encodedURILeadId = encodeURIComponent(ecrytpedLeadID);
    // this.router.navigate(['web/tls_create_proposal/'+ encodedURILeadId]);

  }

  auditLead(lead: any) {
    let reqObj = {
      leadId: lead.leadId
    };

    this.adminService.getAllAudit(reqObj).subscribe((response: any) => {
      let res = JSON.parse(response.data);
      console.log(res.data.allAudit)
      const dialogRef = this.matdialogue.open(AuditpopupComponent, {
        width: "1000px",
        autoFocus: false,
        data: res.data.allAudit
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result);
      });
    },
      error => {
        console.error("API Error:", error);
      }
    );
  }
  onSubmit() {
    if (this.viewLeadForm.get('leadId')?.value) {
      this.filteredArray = this.leadsArray.filter((option: any) => {
        return option?.leadId == this.viewLeadForm.get('leadId')?.value
      });
    } else if (this.viewLeadForm.get('mobileNumber')?.value) {
      this.filteredArray = this.leadsArray.filter((option: any) => {
        return option?.mobileNumber == this.viewLeadForm.get('mobileNumber')?.value
      });
    }
    this.currentPage = 1

  }

  //pagination
  onSelect(event: any) {
    this.itemsPerPage = event.target.value;
  }

  

  disableButton(lead: any) {
    // Implement your logic to disable the button
    // For example, update a property in the item itself that is used for disabling the button
    lead.buttonDisabled = true;
  }
}
