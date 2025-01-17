import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuditComponent } from '../../AV_Upload/audit/audit.component';
import { AdminService } from '../../admin.service';
import { ReassignpopupComponent } from '../reassignpopup/reassignpopup.component';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { AuditpopupComponent } from 'src/app/rug/components/auditpopup/auditpopup.component';
import { SuccesspopupComponent } from 'src/app/rug/components/successpopup/successpopup.component';

@Component({
  selector: 'app-view-for-solo-journey',
  templateUrl: './view-for-solo-journey.component.html',
  styleUrls: ['./view-for-solo-journey.component.scss']
})
export class ViewForSoloJourneyComponent implements OnInit {
  soloJourneyForm!: FormGroup
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  displayedLeads: any[] = [];
  agentCode: any;
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
    this.agentCode = localStorage.getItem("agentCode");
    const reqdata = {
      userId: this.agentCode,
      isSoloJourney: true,
      isUnverifiedLead: false,
      isDualJourney: false,
      isViewLead: false,
      isViewCheckerLead: false,
      pageNumber: this.page,
      pageSize: this.rows
    };

    this.adminService.getLead(reqdata).subscribe((res: any) => {
      try {
        const response = JSON.parse(res.data);
        this.getAllLeads = response.data.leadDetails;
        this.totalRecords = response.data.totalRecords;

        if (this.getAllLeads.length === 0 && this.page > 1) {
          this.page = 1;
          this.getSoloJourneyDetails();
          return;
        }

        console.log(`Page ${this.page}:`, this.getAllLeads);
        this.updateDisplayedData();
      } catch (error) {
        console.error('Error parsing API response:', error);
      }
    });
  }


  updateDisplayedData(): void {
    this.displayedLeads = [...this.getAllLeads];
    console.log('Displayed Leads:', this.displayedLeads);
}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getSoloJourneyDetails();
}

  onInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.displayedLeads = this.getAllLeads.filter((option: any) =>
      option?.refNo?.toLowerCase().includes(this.searchTerm) ||
      option?.proposerName?.toLowerCase().includes(this.searchTerm) ||
      option?.imdCode?.toLowerCase().includes(this.searchTerm) ||
      option?.axisProcess?.toLowerCase().includes(this.searchTerm) ||
      option?.proposalNo?.toLowerCase().includes(this.searchTerm) ||
      option?.planName?.toLowerCase().includes(this.searchTerm) ||
      option?.premium?.toLowerCase().includes(this.searchTerm) ||
      option?.status?.toLowerCase().includes(this.searchTerm) ||
      option?.leadGenerationDate?.toLowerCase().includes(this.searchTerm) ||
      option?.policyNumber?.toLowerCase().includes(this.searchTerm) ||
      option?.policyIssuanceDate?.toLowerCase().includes(this.searchTerm) ||
      option?.disposition?.toLowerCase().includes(this.searchTerm) ||
      option?.subDisposition?.toLowerCase().includes(this.searchTerm) ||
      option?.remark?.toLowerCase().includes(this.searchTerm) ||
      option?.avName?.toLowerCase().includes(this.searchTerm) ||
      option?.avid?.toLowerCase().includes(this.searchTerm) ||
      option?.latestModifiedDateTime?.toLowerCase().includes(this.searchTerm) ||
      option?.axisLocation?.toLowerCase().includes(this.searchTerm)
    );
  }

  auditLead(lead: any) {
    let reqObj = {
      "leadId": lead.refNo,
    }
    this.adminService.getAllAudit(reqObj).subscribe((response: any) => {
      let res = JSON.parse(response.data);
      const dialogRef = this.matdialogue.open(AuditpopupComponent, {
        width: "1000px",
        autoFocus: false,
        data: res.data.allAudit
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result);
      })
    },
      (error: any) => {
        console.log(error);
      });
  }

  ReassignAgent() {
    let AVdata: any = [];
    this.displayedLeads.forEach((element: any) => {
      if (AVdata.findIndex((item: any) => item.avId === element.avid) === -1 && element.avid !== '') {
        AVdata.push({
          avName: element.avName,
          avId: element.avid
        });
      }
    });

    console.log('AVdata:', AVdata);
    const dialogRef = this.matdialogue.open(ReassignpopupComponent, {
      data: {
        AVData: AVdata
      }
    });

    dialogRef.afterClosed().subscribe(async (data: any) => {
      console.log('Dialog closed with data:', data);

      if (data) {
        const selectedLead = this.getAllLeads.find((lead: any) => lead.avid === data);
        const leadId = selectedLead ? selectedLead.refNo : null;

        if (!leadId) {
          console.error('Lead ID not found for the selected AVID');
          return;
        }

        let request = {
          leadId: String(leadId), 
          avId: String(data)     
        };

        console.log('Request payload:', JSON.stringify(request));

        this.adminService.assignToAv(request).subscribe(
          (response: any) => {
            console.log('API Response:', response);
         
              const dialogRef = this.matdialogue.open(SuccesspopupComponent, {
                width: "500px",
                autoFocus: false,
                data: "Successfully Reassigned"
              });
              dialogRef.afterClosed().subscribe((result: any) => {
                console.log(result);
              });
            
          },
          (error: any) => {
            console.error('API Error:', error);
            console.error('Error Details:', error.error); 
          }
        );
      }
    });
  }

  onSelect(event: any) {
    this.itemsPerPage = event.target.value;
  }

  exportToxl() {
    if (this.displayedLeads.length > this.itemsPerPage) {
      this.excelService.exportAsExcelFile(this.displayedLeads.slice(0, this.itemsPerPage), 'solo');
      console.log('export', this.itemsPerPage);
    } else {
      this.excelService.exportAsExcelFile(this.displayedLeads, 'solo');
    }
  }

  clearFilter() {
    this.soloJourneyForm.reset();
  }
}
