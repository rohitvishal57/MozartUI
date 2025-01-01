import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuditComponent } from '../../AV_Upload/audit/audit.component';
import { AdminService } from '../../admin.service';
import { ReassignpopupComponent } from '../reassignpopup/reassignpopup.component';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { AuditpopupComponent } from 'src/app/rug/components/auditpopup/auditpopup.component';
import { SuccessErrorModalComponent } from 'src/app/shared/components/success-error-modal/success-error-modal.component';

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
      this.getAllLeads = response.data.allLeads;
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
      option?.imdCode?.toLowerCase().includes(this.searchTerm) ||
      option?.axisProcess?.toLowerCase().includes(this.searchTerm) ||
      option?.customerName?.toLowerCase().includes(this.searchTerm) ||
      option?.location?.toLowerCase().includes(this.searchTerm) ||
      option?.lgdate?.toLowerCase().includes(this.searchTerm) ||
      option?.pidate?.toLowerCase().includes(this.searchTerm) ||
      option?.axisprocess?.toLowerCase().includes(this.searchTerm)
    );
  }

  auditLead(lead: any) {
    let reqObj = {
      "leadId": lead.refNo,
    }
    this.adminService.getAllAudit(reqObj).subscribe((response:any) => {
          const dialogRef = this.matdialogue.open(AuditpopupComponent, {
            width: "500px",
            autoFocus: false,
            data: response.allAudit
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log(result);
          })
          // this.leadsArray = response.allLeads
        },
        (error:any) => {
          console.log(error);
          // this.loading = false;
        });
  }

  ReassignAgent() {
    interface Element {
      avName: string;
      avId: string;
    }
  
    let AVdata: Element[] = [];
    this.displayedLeads.forEach((element: any) => {
      if (AVdata.findIndex(item => item.avId === element.avid) === -1 && element.avid !== '') {
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
        let request = {
          avId: data 
        };
  
        console.log('Reassign request:', request); 
  
        this.adminService.assignToAv(request).subscribe((response:any) => {
              console.log('API Response:', response);
              if (response.isSuccess && response.statusCode === 200) {
                const dialogRef = this.dialog.open(SuccessErrorModalComponent, {
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
            });
      }
    });
  }
  
  onSelect(event: any) {
    this.itemsPerPage = event.target.value;
  }

  exportToxl() {
    if (this.displayedLeads.length > this.itemsPerPage){
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
