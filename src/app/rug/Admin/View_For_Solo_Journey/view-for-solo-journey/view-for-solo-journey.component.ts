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
  allLeads: any[] = []; 
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
      isSoloJourney: true,
      isUnverifiedLead: false,
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

  onsearch(event: any) {
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
}
