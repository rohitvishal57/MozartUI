import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RugService } from '../../rug.service';
// import { ApiService } from 'src/app/core/services/api.service';
// import { AuditPopupComponent } from 'src/app/shared/components/audit-popup/audit-popup.component';
// import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
// import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-leads',
  templateUrl: './view-leads.component.html',
  // styleUrls: ['./view-leads.component.scss',"../../../../assets/css/main.css",
  // "../../../../assets/css/mobile-main.css"]
})
export class ViewLeadsComponent implements OnInit {
  loginData: any
  localStorageData: any;
  reqBody: any;
  leadsArray: any;
  filteredArray: any;
  viewLeadForm!: FormGroup;
  loading = false;
  agentCode: any
  constructor(
    private router: Router,
    private dialog: MatDialog,
    // private apiService: ApiService,
    private formBuilder: FormBuilder,
    private rugService: RugService
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
    
    this.reqBody = {
      "userId": this.agentCode,
      "isSoloJourney": false,
      "isUnverifiedLead": false,
      "isDualJourney": false,
      "isViewLead": false,
      "isViewCheckerLead": true
    }
    this.loading = true;
    this.rugService.getAllLeads(this.reqBody).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data).data
        this.totalRecords = res.allLeads.length;
        this.allLeads = res.allLeads
        console.log(res);
        this.updateDisplayedData();
      },
      error: (err:any) => {
        console.error(err);
      }
    });
    // this.apiService.postCall(environment.ENDPOINTS.GetLeads, this.reqBody)
    //   .subscribe(
    //     response => {
    //       this.loading = false;
    //       this.leadsArray = response.allLeads;
    //       this.filteredArray = this.leadsArray;
    //     },
    //     error => {
    //       console.log(error);
    //       this.loading = false;
    //     });
  }
  actionLead(lead: any){
    console.log(lead);
    localStorage.setItem('leadId', lead.leadId)
    let data = {
      partnerId: 45,
      productId: 26
    }

    if(lead.planName == 'Health Pro'){
      data.partnerId =  45
      data.productId = 26
      
    }else if(lead.planName == 'Health Pro Infinity'){
      data.partnerId =  45
      data.productId = 27
    }else if(lead.planName == 'Group Activ Secure'){
      data.partnerId =  45
      data.productId = 29
    }else{
      data.partnerId =  45
      data.productId = 29
    }

    this.router.navigate(['rug'], {
      state: { productData: data}
   });
    // let ecrytpedLeadID = this.apiService.encryptUrlData(lead.leadId);
    // let encodedURILeadId = encodeURIComponent(ecrytpedLeadID);
    // this.router.navigate(['web/tls_create_proposal/'+ encodedURILeadId]);

  }
  updateDisplayedData(): void {
    const startIndex = this.first;
    const endIndex = this.first + this.rows;
    console.log(this.allLeads)
    this.displayedAVs = this.allLeads.slice(startIndex, endIndex);
    console.log(this.displayedAVs)
  }
  auditLead(lead: any){
    // let reqObj = {
    //   "leadId": lead.leadId,
    // }
    // this.apiService.postCall(environment.ENDPOINTS.GET_ALL_AUDIT, reqObj)
    // .subscribe(
    //   response => {
    //     const dialogRef = this.dialog.open(AuditPopupComponent, {
    //       width: "500px",
    //       autoFocus: false,
    //       data: response.allAudit
    //     });
    //     dialogRef.afterClosed().subscribe((result: any) => {
    //       console.log(result);
    //     })
    //     // this.leadsArray = response.allLeads
    //   },
    //   error => {
    //     console.log(error);
    //     // this.loading = false;
    //   });
  }
  // actionLead(lead: any){
  //   let ecrytpedLeadID = this.apiService.encryptUrlData(lead.leadId);
  //   let encodedURILeadId = encodeURIComponent(ecrytpedLeadID);
  //   this.router.navigate(['web/tls_create_proposal/'+ encodedURILeadId]);

  // }
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

  //pagination
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


     backToDo(lead:any){
      // let reqObj={
      //   "leadId":lead.leadId
      // }
      // this.apiService.postCall('/TeleSales/AssignBackToDo',reqObj)
      // .subscribe(
      //   response=>{
      //     // this.arr = this.arr.filter((l:any ) => l.refNo !== lead.refNo);
      //     // this.filteredArray = this.filteredArray.filter((l: any) => l.refNo !== lead.refNo);
      //     if(response.statusCode==200){
           
      //     const dialogRef=this.dialog.open(SuccessPopupComponent,{
      //       width: "500px",
      //       autoFocus: false,
      //       data:"Successfully Assigned To DO"
      //     });
      //     dialogRef.afterClosed().subscribe((result:any)=>{
      //       console.log(result)
      //       lead.status='Success'
      //       this.disableButton(lead)
      //     });
      //   }
      // },
      //   error=>{
      //     console.log(error);
      //   });
  
    }
    onPageChange(event: any) {
      // this.first = event.first;
      // this.rows = event.rows;
      // this.page = Math.floor(this.first / this.rows) + 1;
      // this.getAllAVs();
    }

    disableButton(lead: any) {
      // Implement your logic to disable the button
      // For example, update a property in the item itself that is used for disabling the button
      lead.buttonDisabled = true;
    }
}
