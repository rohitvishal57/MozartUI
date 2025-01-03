import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuditComponent } from '../../AV_Upload/audit/audit.component';
import { AdminService } from '../../admin.service';
import { ReassignpopupComponent } from '../reassignpopup/reassignpopup.component';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { AuditpopupComponent } from 'src/app/rug/components/auditpopup/auditpopup.component';

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
      isSoloJourney: true,
      isUnverifiedLead: false,
      isDualJourney: false,
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

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = Math.floor(this.first / this.rows) + 1;
    this.getSoloJourneyDetails();
  }

  onInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.displayedLeads = this.getAllLeads.filter((option: any) =>
      option?.mobileNumber?.toLowerCase().includes(this.searchTerm) ||
      option?.refNo?.toLowerCase().includes(this.searchTerm) ||
      option?.policyNumber?.toLowerCase().includes(this.searchTerm) ||
      option?.axisLocation?.toLowerCase().includes(this.searchTerm) ||
      option?.leadGenerationDate?.toLowerCase().includes(this.searchTerm) ||
      option?.policyIssuanceDate?.toLowerCase().includes(this.searchTerm) ||
      option?.axisProcess?.toLowerCase().includes(this.searchTerm)
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
      // this.leadsArray = response.allLeads
    },
      (error: any) => {
        console.log(error);
        // this.loading = false;
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
        // Extract the leadId from the allLeads array
        const selectedLead = this.getAllLeads.find((lead: any) => lead.avid === data);
        const leadId = selectedLead ? selectedLead.refNo : null;

        if (!leadId) {
          console.error('Lead ID not found for the selected AVID');
          return;
        }

        let request = {
          leadId: String(leadId), // Ensure leadId is a string
          avId: String(data)      // Ensure avId is a string
        };

        console.log('Request payload:', JSON.stringify(request));

        this.adminService.assignToAv(request).subscribe(
          (response: any) => {
            console.log('API Response:', response);
            if (response.isSuccess && response.statusCode === 200) {
              const dialogRef = this.dialog.open(ReassignpopupComponent, {
                width: "2000px",
                autoFocus: false,
                data: "Successfully Reassigned"
              });
              dialogRef.afterClosed().subscribe((result: any) => {
                console.log(result);
              });
            }
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
