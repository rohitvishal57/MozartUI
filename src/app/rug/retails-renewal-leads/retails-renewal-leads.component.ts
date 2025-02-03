import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { RugService } from '../rug.service';
import { SuccessErrorModalComponent } from 'src/app/shared/components/success-error-modal/success-error-modal.component';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
type AccordionKey = 'isPolicyAccordionOpen' | 'isGridAccordionOpen';
@Component({
  selector: 'app-retails-renewal-leads',
  templateUrl: './retails-renewal-leads.component.html',
  styleUrls: ['./retails-renewal-leads.component.scss']
})
export class RetailsRenewalLeadsComponent {
  DispositionOption=['Link Triggered','Policy Renewed','Renewed From Other Mode']
  retailRenewalForm!: FormGroup; // Declare groupRenewalForm as a FormGroup
  loading = false;
  localStorageData: any
  loginData: any;
  allArray:any[] =[];
  accordionStates: { [key in AccordionKey]: boolean } = {
    isPolicyAccordionOpen: true,
    isGridAccordionOpen: true
  };
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


  constructor(private fb: FormBuilder, private dialog:MatDialog,
     private rugService: RugService, private toast: NgToastService,private excelService: ExcelServiceService){}
  async ngOnInit(): Promise<void> {
    this.retailRenewalForm = this.fb.group({
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
    let userObj = {
      currentUser: localStorage.getItem('agentCode')
    }
    this.loading = true;
    this.rugService.getRetailRenewalPhaseTwoLeads(userObj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data)
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
          res = res.data
            this.arr = res.retailProposalList;
            this.allArray = res.retailProposalList;
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
    // await this.apiService.postCall(environment.ENDPOINTS.RETAIL_GRID, userObj)
    // .subscribe(
    //   response => {
    //     this.loading = false;
    //     console.log(response);
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //         this.arr = response.retailProposalList
    //         ;
    //         this.allArray = response.retailProposalList
    //         ;
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

  isAccordionOpen:boolean=true
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  filteredArray: any


  // for accordion 
  toggleAccordion(accordionName: AccordionKey) {
    this.accordionStates[accordionName] = !this.accordionStates[accordionName];
  }

  onSelect(event:any){
    this.itemsPerPage = event.target.value;
  }


  clearFilter(){
    this.retailRenewalForm.reset()
    this.arr = this.allArray
    this.currentPage = 1
  }
  openAudit(value: any){
    // let rowData = value;
    // const dialogRef = this.dialog.open(GroupRenewalAuditComponent, {
    //   width: "500px",
    //   autoFocus: false,
    //   data: rowData
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log(result);
    // })
  }
  async reTrigger(data:any){
    console.log(data)
    let retailObj = {
      leadId: data.leadId,  //which is passed on above api get response leadid
      isRenewal: true //Always true
    }
    this.loading = true;
      this.rugService.sendRetailLinkToCustomer(retailObj).subscribe({
          next: (res: any) => {
            console.log(res);
            res = JSON.parse(res.data)
            console.log(res);
              if (res.isSuccess == true && res.statusCode == 200) {
                // window.location.href = res.redirectUrl;
                // window.open(res.redirectUrl);
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
                //   autoFocus: false,~~
                //   data: res.statusMessage
                // });
                dialogRef.afterClosed().subscribe((result: any) => {
                  console.log(result);
                  // this.router.navigate(['renewal/srl_thankyou/'+ this.leadId]);
                })
              }
              if (res.isSuccess == false && res.statusCode == 500) {
                this.toast.warning({ detail: "Warning", summary: res.errorMessage, duration: 5000 });
              }
    
          },
          error: (err) => {
            console.error(err);
          }
        });
    // await this.apiService.postRenewalCall(environment.ENDPOINTS.SEND_RETAIL_LINK_TO_CUSTOMER, retailObj)
    //   .subscribe(
    //     response => {
    //       this.loading = false;
    //       if (response.isSuccess == true && response.statusCode == 200) {
    //         // window.location.href = response.redirectUrl;
    //         // window.open(response.redirectUrl);
    //         const dialogRef = this.dialog.open(SuccessPopupComponent, {
    //           width: "500px",
    //           autoFocus: false,
    //           data: response.statusMessage
    //         });
    //         dialogRef.afterClosed().subscribe((result: any) => {
    //           console.log(result);
    //           // this.router.navigate(['renewal/srl_thankyou/'+ this.leadId]);
    //         })
    //       }
    //       if (response.isSuccess == false && response.statusCode == 500) {
    //         this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
    //       }
    //     },
    //     error => {
    //       console.log(error);
    //       this.loading = false;
    //     });
  }


  flterBetweenDates(){
    if(this.retailRenewalForm.get('grplmdFrom')?.invalid && this.retailRenewalForm.get('grplmdTo')?.invalid){
    // const start = new Date(this.retailRenewalForm.get('grplmdFrom')?.value);
    // const end = new Date(this.retailRenewalForm.get('grplmdTo')?.value);
    this.arr = this.filterByDateRange(this.arr, this.convertDateFormat(this.retailRenewalForm.get('grplmdFrom')?.value), this.convertDateFormat(this.retailRenewalForm.get('grplmdTo')?.value));
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
    if(this.retailRenewalForm.get('grplmdFrom')?.value && this.retailRenewalForm.get('grplmdTo')?.value){

      this.arr =   this.filterByDateRange(this.arr, this.convertDateFormat(this.retailRenewalForm.get('grplmdFrom')?.value), this.convertDateFormat(this.retailRenewalForm.get('grplmdTo')?.value));
    }
    if(this.retailRenewalForm.get('grpocccenter')?.value){
      
      this.arr = this.arr.filter((option:any) =>
        option?.axisCenter?.toLowerCase().includes(this.retailRenewalForm.get('grpocccenter')?.value.toLowerCase())
      )
    }
    if(this.retailRenewalForm.get('grpoldcoi')?.value){

      this.arr = this.arr.filter((option:any) =>
        option?.oldPolicyNumber?.toLowerCase().includes(this.retailRenewalForm.get('grpoldcoi')?.value.toLowerCase())
      )
    }
    if(this.retailRenewalForm.get('grdisposition')?.value){

      this.arr = this.arr.filter((option:any) =>
        option?.currentStatus?.toLowerCase().includes(this.retailRenewalForm.get('grdisposition')?.value.toLowerCase())
      )
    }
    if(this.retailRenewalForm.get('grpexistingcoi')?.value){

      this.arr = this.arr.filter((option:any) =>
        option?.renewedPolicyNumber?.toLowerCase().includes(this.retailRenewalForm.get('renewedPolicyNumber')?.value.toLowerCase())
      )
    }
    this.currentPage = 1
  }
}
