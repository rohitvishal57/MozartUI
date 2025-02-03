import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
// import { GroupRenewalAuditComponent } from '../group-renewal-audit/group-renewal-audit.component';
// import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
// import { Utility } from 'src/app/utility/utility';
import { elementAt } from 'rxjs';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { NgToastService } from 'ng-angular-popup';
import { RugService } from '../rug.service';
import { SuccessErrorModalComponent } from 'src/app/shared/components/success-error-modal/success-error-modal.component';


@Component({
  selector: 'app-group-renewal-phase-2-leads',
  templateUrl: './group-renewal-phase-2-leads.component.html',
  styleUrls: ['./group-renewal-phase-2-leads.component.scss']
})
export class GroupRenewalPhase2LeadsComponent implements OnInit{
  // DispositionOption=['Disposition Saved','Renewal Link Triggered','Pending For Verification','Policy Renewed','Regenerate Lead','Renewed From Other Mode']
  DispositionOption=['Link Triggered','Policy Renewed','Renewed From Other Mode']
  groupRenewalForm!: FormGroup; // Declare groupRenewalForm as a FormGroup
  loading = false;
  localStorageData: any
  loginData: any;
  allArray:any[] =[];
  userObj:any
  leadType:any= 'group'
  constructor(private fb: FormBuilder, private dialog:MatDialog,
    private excelService: ExcelServiceService,  private rugService: RugService,
        private toast: NgToastService) {}

  async ngOnInit(): Promise<void> {
    this.groupRenewalForm = this.fb.group({
      grplmdFrom: ['', Validators.pattern('^\d{4}-\d{2}-\d{2}$')],
      grplmdTo:['', Validators.pattern('^\d{4}-\d{2}-\d{2}$')],
      grpocccenter:[''],
      grpoldcoi:[''],
      grpexistingcoi:[''],
      grdisposition:['']
      
    });
    if (localStorage.getItem("currentUser") !== null) {
      this.localStorageData = localStorage.getItem("currentUser");
      this.loginData =  JSON.parse(this.localStorageData);
    }
    this.userObj = {
      currentUser: localStorage.getItem('agentCode')
    }
    this.loading = true;

    this.rugService.getGroupRenewalPhaseTwoLeads(this.userObj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data)
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
          res = res.data
          this.arr = res.groupRenewalPhase2Leads;
          this.allArray = res.groupRenewalPhase2Leads;
        }
        if (res.isSuccess == false && res.statusCode == 500) {
          this.toast.warning({ detail: "Warning", summary: res.errorMessage, duration: 5000 });
          // this.toastr.warning(res.errorMessage, '', { timeOut: 5000 });
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
    // await this.apiService.postCall(environment.ENDPOINTS.GET_GROUP_RENEWAL_PHASE_TWO_LEADS, this.userObj)
    // .subscribe(
    //   response => {
    //     this.loading = false;
    //     console.log(response);
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //         this.arr = response.groupRenewalPhase2Leads;
    //         this.allArray = response.groupRenewalPhase2Leads;
    //         // this.sortList()
    //     }
    //     if (response.isSuccess == false && response.statusCode == 500) {
    //       this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     this.loading = false;
    //   });
  }
  arr: any[] = [
    {
        Exp_date: '28/6/2024',
        Policy_no: 'GHI-XL-22-2001816-2',
        Cust_name: 'Rajesh Vijaya Kumar',
        Product_name: 'Group Activ Health V2',
        Old_imd: '',
        Old_gross_premium: 32798.1,
        Renewal_gross_premium: 32798.1,
        DO_id: 'SEBLDO705533',
        AV_id: '',
        Center: 'Bangalore',
        prop_id: '21715748398_03', // Assuming this is a string
        Disposition: 'Interested',
        Sub_disposition: 'Journey by DO/Agent for Renewal',
        status: 'Renewal Link Triggered',
        Modified_date: '25/06/2024 11:48:51',
        Renewed_policy_no: 1222,
        Renewed_gross_premium: 4454.2,
        Renewed_net_premium: 444.32,
        Date_post_rnewal: '28/6/2024',
        Insurance_date_time: '28/6/2024',
        New_Imd: 777,
        Hr_amount: 0,
        Hr_flag: 'no',
        attempts: 1,
        connects: 1
    },
    {
      Exp_date: '22/6/2024',
      Policy_no: 'GHI-XL-22-2001816-2',
      Cust_name: 'Kumar',
      Product_name: 'Group Activ Health V2',
      Old_imd: '',
      Old_gross_premium: 32798.1,
      Renewal_gross_premium: 32798.1,
      DO_id: 'SEBLDO705533',
      AV_id: '',
      Center: 'Mysore',
      prop_id: '21715748398_03', // Assuming this is a string
      Disposition: 'Interested',
      Sub_disposition: 'Journey by DO/Agent for Renewal',
      status: 'Renewal Link Triggered',
      Modified_date: '25/06/2024 11:48:51',
      Renewed_policy_no: 1222,
      Renewed_gross_premium: 4454.2,
      Renewed_net_premium: 444.32,
      Date_post_rnewal: '28/6/2024',
      Insurance_date_time: '28/6/2024',
      New_Imd: 777,
      Hr_amount: 0,
      Hr_flag: 'no',
      attempts: 1,
      connects: 1
  },
  {
    Exp_date: '8/6/2024',
    Policy_no: 'GHI-XL-22-2001816-2',
    Cust_name: 'Priyanaka',
    Product_name: 'Group Activ Health V2',
    Old_imd: '',
    Old_gross_premium: 32222.1,
    Renewal_gross_premium: 3222.1,
    DO_id: 'SEBLDO705533',
    AV_id: '',
    Center: 'Mumbai',
    prop_id: '21715748398_03', // Assuming this is a string
    Disposition: 'Interested',
    Sub_disposition: 'Journey by DO/Agent for Renewal',
    status: 'Renewal Link Triggered',
    Modified_date: '25/06/2024 11:48:51',
    Renewed_policy_no: 1222,
    Renewed_gross_premium: 4454.2,
    Renewed_net_premium: 444.32,
    Date_post_rnewal: '28/6/2024',
    Insurance_date_time: '28/6/2024',
    New_Imd: 777,
    Hr_amount: 0,
    Hr_flag: 'no',
    attempts: 1,
    connects: 1
},
{
  Exp_date: '2/6/2024',
  Policy_no: 'GHI-XL-22-2001816-2',
  Cust_name: 'Gautam Pandey',
  Product_name: 'Group Activ Health V2',
  Old_imd: '',
  Old_gross_premium: 32798.1,
  Renewal_gross_premium: 32798.1,
  DO_id: 'SEBLDO705533',
  AV_id: '',
  Center: 'Bangalore',
  prop_id: '21715748398_03', // Assuming this is a string
  Disposition: 'Interested',
  Sub_disposition: 'Journey by DO/Agent for Renewal',
  status: 'Renewal Link Triggered',
  Modified_date: '25/06/2024 11:48:51',
  Renewed_policy_no: 1222,
  Renewed_gross_premium: 4454.2,
  Renewed_net_premium: 444.32,
  Date_post_rnewal: '28/6/2024',
  Insurance_date_time: '28/6/2024',
  New_Imd: 777,
  Hr_amount: 0,
  Hr_flag: 'no',
  attempts: 1,
  connects: 1
},

    
    // Add more objects as needed
];

  isAccordionOpen:boolean=true
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  filteredArray: any




  // for accordion 
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  onSelect(event:any){
    this.itemsPerPage = event.target.value;
    
  }

  onInput(event:any){
   
    this.searchTerm = event.target.value
    this.arr = this.arr.filter((option:any) =>
      option?.axisCenter?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.policyNo?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.custName?.toLowerCase().includes(this.searchTerm.toLowerCase())
  ||  option?.productName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.proposalId?.toLowerCase().includes(this.searchTerm.toLowerCase())
    || option?.currentStatus?.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  this.currentPage = 1
  // this.sortList()
  }

  clearFilter(){
    this.groupRenewalForm.reset()
    this.arr = this.allArray
    this.currentPage = 1
  }
  openAudit(value: any){
    let rowData = value;
    // const dialogRef = this.dialog.open(GroupRenewalAuditComponent, {
    //   width: "500px",
    //   autoFocus: false,
    //   data: rowData
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log(result);
    // })
  }
  async retriggerLink(item: any){
    console.log(item.referenceId);
    let linkObj = {
      leadId: item.referenceId,
      isRenewal: true
    }
    this.loading = true;
       this.rugService.sendLinkToCustomer(linkObj).subscribe({
          next: (res: any) => {
            console.log(res);
            res = JSON.parse(res.data)
            console.log(res);
           if (res.isSuccess == true && res.statusCode == 200) {
              console.log(res);
              const dialogRef = this.dialog.open(SuccessErrorModalComponent, {
                //width: '400px',
                disableClose: true,
                panelClass:"messageModal-mat",
                data: {
                  type: 'success', 
                  title: 'Renewal',
                  message: ` ${res.statusMessage}`
                },
              });
              // const dialogRef = this.dialog.open(SuccessPopupComponent, {
              //   width: "500px",
              //   autoFocus: false,
              //   data: res.statusMessage
              // });
              dialogRef.afterClosed().subscribe((result: any) => {
                console.log(result);
                // this.router.navigate(['renewal/srl_thankyou/'+ this.leadId]);
              })
            }
            if (res.isSuccess == false && res.statusCode == 500) {
              this.toast.warning({ detail: "Warning", summary: res.errorMessage, duration: 5000 });
              // this.toastr.warning(res.errorMessage, '', { timeOut: 5000 });
            }
          },
          error: (err) => {
            console.error(err);
          }
        });
    // await this.apiService.postRenewalCall(environment.ENDPOINTS.SEND_LINK_TO_CUSTOMER, linkObj)
    // .subscribe(
    //   response => {
    //     this.loading = false;
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //       console.log(response);
    //       const dialogRef = this.dialog.open(SuccessPopupComponent, {
    //         width: "500px",
    //         autoFocus: false,
    //         data: response.statusMessage
    //       });
    //       dialogRef.afterClosed().subscribe((result: any) => {
    //         console.log(result);
    //         // this.router.navigate(['renewal/srl_thankyou/'+ this.leadId]);
    //       })
    //     }
    //     if (response.isSuccess == false && response.statusCode == 500) {
    //       this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     this.loading = false;
    //   });
  }


  flterBetweenDates(){
    if(this.groupRenewalForm.get('grplmdFrom')?.invalid && this.groupRenewalForm.get('grplmdTo')?.invalid){
    // const start = new Date(this.groupRenewalForm.get('grplmdFrom')?.value);
    // const end = new Date(this.groupRenewalForm.get('grplmdTo')?.value);
    this.arr = this.filterByDateRange(this.arr, this.convertDateFormat(this.groupRenewalForm.get('grplmdFrom')?.value), this.convertDateFormat(this.groupRenewalForm.get('grplmdTo')?.value));
    this.currentPage = 1
    }


  }
  filterByDateRange(items: any[], startDate: string, endDate: string): any[] {
    // Ensure the dates are valid
    // if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    //     throw new Error("Invalid date provided.");
    // }
    let start = new Date(startDate)
    let end = new Date(endDate)

    // Ensure the startDate is not after the endDate
    if (start > end) {
        throw new Error("Start date cannot be after end date.");
    }

    return items.filter(item => {
        const itemDate = item.lastModifiedDate ? this.parseDate(item.lastModifiedDate?.split(' ')[0]) : item.lastModifiedDateTime ? this.parseDate(item.lastModifiedDateTime?.split(' ')[0]) :'';
        return itemDate >= start && itemDate <= end;
    });
}
parseDate(dateStr: string): Date {
  const [month, day, year] = dateStr.split('/').map(Number);
  // Note: month - 1 because JavaScript months are zero-based
  console.log(new Date(year, month - 1, day))
  return new Date(year, month - 1, day);
}
  convertDateFormat(dateStr:any) {
    // Parse the date string into components
    const [year, month, day] = dateStr.split('-').map(Number);

    // Format the date components into 'MM-DD-YYYY'
    const formattedDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;
    return formattedDate;
}

  exportToxl(){
    this.excelService.exportAsExcelFile(this.arr, 'Group_Phase_2_Leads')
  }

  onChnage(event:any){
    this.searchTerm = event.target.value
    this.currentPage = 1
    this.arr = this.allArray.filter((option:any) =>
      option?.occCenter?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.currentStatus?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.custName?.toLowerCase().includes(this.searchTerm.toLowerCase())
  ||  option?.productName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.proposalId?.toLowerCase().includes(this.searchTerm.toLowerCase())
    || option?.oldPolicyNumber?.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  }
  onSubmit(){
    if(this.groupRenewalForm.get('grplmdFrom')?.value && this.groupRenewalForm.get('grplmdTo')?.value){

      this.arr =   this.filterByDateRange(this.arr, this.convertDateFormat(this.groupRenewalForm.get('grplmdFrom')?.value), this.convertDateFormat(this.groupRenewalForm.get('grplmdTo')?.value));
    }
    if(this.groupRenewalForm.get('grpocccenter')?.value){
      
      this.arr = this.arr.filter((option:any) =>
        option?.axisCenter?.toLowerCase().includes(this.groupRenewalForm.get('grpocccenter')?.value.toLowerCase())
      )
    }
    if(this.groupRenewalForm.get('grpoldcoi')?.value){

      this.arr = this.arr.filter((option:any) =>
        option?.oldPolicyNumber?.toLowerCase().includes(this.groupRenewalForm.get('grpoldcoi')?.value.toLowerCase())
      )
    }
    if(this.groupRenewalForm.get('grdisposition')?.value){

      this.arr = this.arr.filter((option:any) =>
        option?.currentStatus?.toLowerCase().includes(this.groupRenewalForm.get('grdisposition')?.value.toLowerCase())
      )
    }
    if(this.groupRenewalForm.get('grpexistingcoi')?.value){

      this.arr = this.arr.filter((option:any) =>
        option?.renewedPolicyNumber?.toLowerCase().includes(this.groupRenewalForm.get('renewedPolicyNumber')?.value.toLowerCase())
      )
    }
    this.currentPage = 1
  }

  async onChange(event:any){    
    if(event.target.value == 'group'){
      this.loading = true;
      this.leadType = 'group'
      this.rugService.getRetailRenewalPhaseTwoLeads(this.userObj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data)
          console.log(res);
          if (res.isSuccess == true && res.statusCode == 200) {
            res = res.data
            this.arr = res.groupRenewalPhase2Leads;
            this.allArray = res.groupRenewalPhase2Leads;
          }
          if (res.isSuccess == false && res.statusCode == 500) {
            this.toast.warning({ detail: "Warning", summary: res.errorMessage, duration: 5000 });
            // this.toastr.warning(res.errorMessage, '', { timeOut: 5000 });
          }
  
        },
        error: (err) => {
          console.error(err);
        }
      });
      // await this.apiService.postCall(environment.ENDPOINTS.GET_GROUP_RENEWAL_PHASE_TWO_LEADS, this.userObj)
      // .subscribe(
      //   response => {
      //     this.loading = false;
      //     console.log(response);
      //     if (response.isSuccess == true && response.statusCode == 200) {
      //         this.arr = response.groupRenewalPhase2Leads;
      //         this.allArray = response.groupRenewalPhase2Leads;
      //     }
      //     if (response.isSuccess == false && response.statusCode == 500) {
      //       this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
      //     }
      //   },
      //   error => {
      //     console.log(error);
      //     this.loading = false;
      //   });
    }else{
      this.leadType = 'retail'
    }
  }
  // sortList(){
  //   console.log(this.arr,"Sort")
  //   return this.arr.sort((a, b) => { return new Date(b.expiryDateBeforeRenewal).getTime() - new Date(a.expiryDateBeforeRenewal).getTime(); })// Reverse the order });
 

    
   
  // }

}
