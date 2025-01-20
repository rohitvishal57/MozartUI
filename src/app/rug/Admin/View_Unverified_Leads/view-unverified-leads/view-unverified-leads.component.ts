import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuditComponent } from '../../AV_Upload/audit/audit.component';
import { AdminService } from '../../admin.service';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { AuditpopupComponent } from 'src/app/rug/components/auditpopup/auditpopup.component';
import { SuccessErrorModalComponent } from 'src/app/shared/components/success-error-modal/success-error-modal.component';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-unverified-leads',
  templateUrl: './view-unverified-leads.component.html',
  styleUrls: ['./view-unverified-leads.component.scss']
})
export class ViewUnverifiedLeadsComponent implements OnInit {
  soloJourneyForm!: FormGroup
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedLeads: any[] = [];
  searchTerm: string = '';
  today: string = '';
  agentCode: any;
  filterAllAvs = [];
  getAllLeads: any[] = [];
  filteredArray: any;
  itemsPerPage = 10;
  currentPage = 1;

  Location: any[] = ["Noida", "Hyderabad", "Bangalore", "Mumbai", "Kolkata"];
  AxisProcess: any[] = ["Inbound Phone Banking", "Outbound Call Center (OCC)"];
  dialog: any;
  item: any;
  constructor(private fb: FormBuilder, private adminService: AdminService, private excelService: ExcelServiceService, private matdialogue: MatDialog, private router: Router) {

  }
  ngOnInit(): void {
    this.inItForm();
    this.getSoloJourneyDetails();
  }

  inItForm() {
    this.soloJourneyForm = this.fb.group({
      mobileno: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      leadid: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      policyno: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      location: ['', Validators.required],
      lgdate: ['', Validators.required],
      pidate: ['', Validators.required],
      axisprocess: ['', Validators.required]
    });
  }

  getSoloJourneyDetails(): void {
    this.agentCode = localStorage.getItem("agentCode");
    const filters = {
      RefNo: [this.soloJourneyForm.controls['leadid'].value.toString()].filter(value => value),
      MobileNumber: [this.soloJourneyForm.controls['mobileno'].value.toString()].filter(value => value.toString()),
      LeadGenerationDate: [this.soloJourneyForm.controls['lgdate'].value.toString()].filter(value => value),
      PolicyNumber: [this.soloJourneyForm.controls['policyno'].value.toString()].filter(value => value),
      AxisLocation: [this.soloJourneyForm.controls['location'].value.toString()].filter(value => value),
      AxisProcess: [this.soloJourneyForm.controls['axisprocess'].value.toString()].filter(value => value),
      PolicyInsuraceDate: [this.soloJourneyForm.controls['pidate'].value.toString()].filter(value => value)
    };
  
    const reqdata = {
      userId: this.agentCode,
      isSoloJourney: false,
      isUnverifiedLead: true,
      isDualJourney: false,
      isViewLead: false,
      isViewCheckerLead: false,
      pageNumber: this.searchTerm ? 1 : this.page, 
      pageSize: this.searchTerm ? 10 : this.rows, 
      filters: filters
    };
  
    console.log('Request Data:', reqdata);
    this.adminService.getLead(reqdata).subscribe(
      (res: any) => {
        try {
          const response = JSON.parse(res.data);
          console.log('API Response Data:', response);
          this.getAllLeads = response.data.leadDetails;
          this.displayedLeads = [...this.getAllLeads]; 
          this.totalRecords = this.searchTerm ? this.getAllLeads.length : response.data.totalRecords;
          if (this.getAllLeads.length === 0 && this.searchTerm) {
            console.warn('No data found for the provided refNo:', this.searchTerm);
            this.displayedLeads = []; 
          }
        } catch (error) {
          console.error('Error parsing response:', error);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
  
  onInput(event: any): void {
    this.searchTerm = event.target.value.trim().toLowerCase(); 
    console.log('Search Term:', this.searchTerm);
    this.getSoloJourneyDetails(); 
  }
  
  onPageChange(event: any): void {
    if (!this.searchTerm) {
      this.first = event.first;
      this.rows = event.rows;
      this.page = Math.floor(this.first / this.rows) + 1;
      this.getSoloJourneyDetails();
    }
  }

  actionLead(lead: any) {
    console.log(lead);
    localStorage.setItem('leadId', lead.leadNo)
    let data = {
      partnerId: 45,
      productId: 26
    }

    if (lead.planName == 'Health Pro') {
      data.partnerId = 45
      data.productId = 26

    } else if (lead.planName == 'Health Pro Infinity') {
      data.partnerId = 45
      data.productId = 27
    } else if (lead.planName == 'Group Activ Secure') {
      data.partnerId = 45
      data.productId = 29
    } else {
      data.partnerId = 45
      data.productId = 29
    }

    this.router.navigate(['rug'], {
      state: { productData: data }
    });
    // let ecrytpedLeadID = this.apiService.encryptUrlData(lead.leadId);
    // let encodedURILeadId = encodeURIComponent(ecrytpedLeadID);
    // this.router.navigate(['web/tls_create_proposal/'+ encodedURILeadId]);

  }

  backToDo(lead: any) {
    let reqObj = {
      "leadId": lead.leadNo
    }
    this.adminService.AssignBackToDo(reqObj).subscribe((response: any) => {
      let res = JSON.parse(response.data)
      console.log('SuccessPopUp', res)
      const dialogRef = this.matdialogue.open(SuccesspopupComponent, {
        width: "500px",
        autoFocus: false,
        data: res.message
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result)
      });
    },
      error => {
        console.log(error);
      });

  }

  auditLead(lead: any) {
    let reqObj = {
      leadId: lead.leadNo // Use leadId for the request
    };

    this.adminService.getAllAudit(reqObj).subscribe((response: any) => {
      let res = JSON.parse(response.data);
      console.log(res.allAudit)
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

  onSelect(event: any) {
    this.itemsPerPage = event.target.value;
  }

  exportToxl() {
    if (this.getAllLeads.length > this.itemsPerPage) {
      this.excelService.exportAsExcelFile(this.filteredArray.slice(0, this.itemsPerPage), 'solo');
      console.log('export', this.itemsPerPage)
    } else {
      this.excelService.exportAsExcelFile(this.filteredArray, 'solo')
    }
  }

  clearFilter() {
    this.soloJourneyForm.reset();
    this.searchTerm = '';
    this.page = 1;
    this.getSoloJourneyDetails();
  }
  
}
