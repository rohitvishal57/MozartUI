import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RugService } from '../../rug.service';
import { AdminService } from '../../Admin/admin.service';
import { AuditpopupComponent } from '../auditpopup/auditpopup.component';
import { SuccesspopupComponent } from '../successpopup/successpopup.component';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-view-maker-checker-leads',
  templateUrl: './view-maker-checker-leads.component.html',
  styleUrls: ['./view-maker-checker-leads.component.scss']
})
export class ViewMakerCheckerLeadsComponent implements OnInit{
  loginData: any
  localStorageData: any;
  reqBody: any;
  leadsArray: any;
  filteredArray: any;
  viewLeadForm!: FormGroup;
  loading = false;
  agentCode: any
  mobileNumber: string = ""
  leadId: string = '';
  searchInputControl = new FormControl("");
  constructor(
    private router: Router,
    private dialog: MatDialog,
 private adminService: AdminService,
    private formBuilder: FormBuilder,
    private rugService: RugService,
    private matdialogue: MatDialog,
    private yatraService: YatraService,
     private toast: NgToastService
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
  policyDetails:any = [];
  ngOnInit(): void {
    this.viewLeadForm = this.formBuilder.group({
      mobileNumber: [''],
      leadId: [''],
    })
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
      isViewLead: false,
      isViewCheckerLead: true,
      pageNumber: this.page,
      pageSize: this.rows,
      filters: filters,
    }
    this.loading = true;
    this.adminService.getLead(this.reqBody).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data);
        this.allLeads = res.data.leadDetails;
        console.log(res);
        this.totalRecords = this.searchTerm ? this.allLeads.length : res.data.totalRecords;
        this.displayedAVs = [...this.allLeads];
      },
      error: (err:any) => {
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
  
  actionLead(lead: any) {
    let reqObj = {
      "leadId": lead.leadId
    };

    this.rugService.getTcPolicyInfoByLeadId(reqObj).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data).data;
        this.policyDetails = res.policyDetails;
        console.log(this.policyDetails);
        let data = {
          partnerId: lead.partnerId,
          productId: lead.productId
        };
        if (this.policyDetails && this.policyDetails.length > 0) {
          const quoteType = this.policyDetails[0].quoteType;
          if (quoteType === "FULLQUOTE") {
            this.toast.success({ detail: "Success", summary: "Policy is already generated for this Lead Id", duration: 3000 });
          } else {
            console.log(lead);
            localStorage.setItem('leadId', lead.leadId);
            this.router.navigate(['rug'], {
              state: { productData: data }
            });
          }
        } else {
          localStorage.setItem('leadId', lead.leadId);
          this.router.navigate(['rug'], {
            state: { productData: data }
          });
        }
      },
      error: (err) => {
        console.error(err);
        alert("Error fetching policy details!");
      }
    });
}

  updateDisplayedData(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    console.log(this.allLeads)
    this.displayedAVs = this.allLeads.slice(startIndex, endIndex);
    console.log(this.displayedAVs)
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
      (error: any) => {
        console.error("API Error:", error);
      }
    );
  }
  
  onSubmit(){
    if(this.viewLeadForm.get('leadId')?.value){
      this.filteredArray = this.leadsArray.filter((option:any) =>{
      return  option?.leadId == this.viewLeadForm.get('leadId')?.value  
      });
    }else if(this.viewLeadForm.get('mobileNumber')?.value){
      this.filteredArray = this.leadsArray.filter((option:any) => {
       return option?.mobileNumber == this.viewLeadForm.get('mobileNumber')?.value
      });
    }
    this.currentPage = 1

  }

  onSelect(event:any){
    this.itemsPerPage = event.target.value;
    }

    onInput(event:any){
      this.searchTerm = event.target.value
      this.filteredArray = this.leadsArray.filter((option:any) =>
        option?.leadId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||  option?.mobileNumber?.includes(this.searchTerm) || option?.proposalNo?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    ||  option?.planName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.leadGenerationDate?.toLowerCase().includes(this.searchTerm.toLowerCase())
      || option?.policyIssuanceDate?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1
     }


    backToDo(lead: any) {
        let reqObj = {
          "leadId": lead.leadId
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

    disableButton(lead: any) {
      // Implement your logic to disable the button
      // For example, update a property in the item itself that is used for disabling the button
      lead.buttonDisabled = true;
    }
}
