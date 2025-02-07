import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/rug/Admin/admin.service';
import { ExcelServiceService } from 'src/app/services/excel-service.service';

@Component({
  selector: 'app-hdfc-bata-leads-list',
  templateUrl: './hdfc-bata-leads-list.component.html',
  styleUrls: ['./hdfc-bata-leads-list.component.scss']
})
export class HdfcBataLeadsListComponent {
soloJourneyForm!: FormGroup
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  extrarows: number = 1000;
  totalRecords: number = 0;
  displayedLeads: any[] = [];
  agentCode: any;
  searchTerm: string = '';
  today: string = '';
  filterAllAvs = [];
  getAllLeads: any[] = [];
  filteredArray: any;
  itemsPerPage = 100;
  currentPage = 1;
  allLeads: any[] = [];
  Location: any[] = ["Noida", "Hyderabad", "Bangalore", "Mumbai", "Kolkata"];
  AxisProcess: any[] = ["Inbound Phone Banking", "Outbound Call Center (OCC)"];
  dialog: any;
  item: any;
  AllAgentsNames:any;
  avData:any = [];
  isShow:boolean = true;

  constructor(private fb: FormBuilder, private adminService: AdminService, private matdialogue: MatDialog, private router:Router) {
  
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
        pageNumber: this.page,
        pageSize: this.rows,
        filters: filters
      };
  
      console.log('Request Data:', reqdata);
  
      this.adminService.getLead(reqdata).subscribe((res: any) => {
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

    selectJourney(){
      this.router.navigate(['/rug/hdfc_JourneySelection']);
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
  
    onSelect(event: any) {
      this.itemsPerPage = event.target.value;
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
