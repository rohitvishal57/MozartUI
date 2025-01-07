import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';
import { AuditpopupComponent } from 'src/app/rug/components/auditpopup/auditpopup.component';

@Component({
  selector: 'app-view-for-dual-journey',
  templateUrl: './view-for-dual-journey.component.html',
  styleUrls: ['./view-for-dual-journey.component.scss']
})
export class ViewForDualJourneyComponent implements OnInit {
  soloJourneyForm!: FormGroup
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedLeads: any[] = [];
  searchTerm: string = '';
  today: string = '';
  filterAllAvs = [];
  getAllLeads: any[] = [];
  filteredArray: any;
  itemsPerPage = 10;
  currentPage = 1;

  Location: any[] = ["Noida", "Hyderabad", "Bangalore", "Mumbai", "Kolkata"];
  AxisProcess: any[] = ["Inbound Phone Banking", "Outbound Call Center (OCC)"];
  dialog: any;
  item: any;
  constructor(private fb: FormBuilder, private adminService: AdminService, private excelService: ExcelServiceService, private matdialogue: MatDialog) {

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
    const reqdata = {
      userId: '467895',
      isSoloJourney: false,
      isUnverifiedLead: false,
      isDualJourney: true,
      isViewLead: false,
      isViewCheckerLead: false,
      pageNumber: this.page,
      pageSize: this.rows
    };

    this.adminService.getLead(reqdata).subscribe((res: any) => {
      const response = JSON.parse(res.data);
      this.getAllLeads = response.data.leadDetails;
      console.log('getAllLeads', this.getAllLeads)
      console.log(this.getAllLeads.length)
      this.totalRecords = this.getAllLeads.length;
      this.updateDisplayedData();
    });
  }

  updateDisplayedData(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    this.displayedLeads = this.getAllLeads.slice(startIndex, endIndex);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  exportToxl() {
    if (this.displayedLeads.length > this.itemsPerPage) {
      this.excelService.exportAsExcelFile(this.displayedLeads.slice(0, this.itemsPerPage), 'dual');
      console.log('export', this.itemsPerPage);
    } else {
      this.excelService.exportAsExcelFile(this.displayedLeads, 'dual');
    }
  }

  backToDo(lead: any) {
    let reqObj = {
      "leadId": lead.refNo
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
      leadId: lead.refNo // Use leadId for the request
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

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getSoloJourneyDetails();
  }

  onInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.displayedLeads = this.getAllLeads.filter((option: any) =>
      option?.imdCode?.toLowerCase().includes(this.searchTerm) ||
      option?.axisProcess?.toLowerCase().includes(this.searchTerm) ||
      option?.customerName?.toLowerCase().includes(this.searchTerm) ||
      option?.location?.toLowerCase().includes(this.searchTerm) ||
      option?.lgdate?.toLowerCase().includes(this.searchTerm) ||
      option?.pidate?.toLowerCase().includes(this.searchTerm) ||
      option?.axisprocess?.toLowerCase().includes(this.searchTerm)
    );
  }

  ReassignAgent(leadNo: string) {
    interface Element {
      avName: string;
      avId: string;
      // You can add more properties here if needed
    }
    let AVdata: Element[] = [];
    this.getAllLeads.forEach((element: any) => {
      if (AVdata.findIndex(item => item.avId == element.avid) == -1 && element.avid != '') {
        AVdata.push({
          avName: element.avName,
          avId: element.avid
        });
      }
    });
  }
  onSelect(event: any) {
    this.itemsPerPage = event.target.value;
  }
  
  clearFilter() {
    this.soloJourneyForm.reset();
  }

}
