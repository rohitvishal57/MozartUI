import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { RugService } from '../rug.service';
import { NgToastService } from 'ng-angular-popup';
import { SuccessErrorModalComponent } from 'src/app/shared/components/success-error-modal/success-error-modal.component';
// import { SuccessPopupComponent } from 'src/app/shared/components/success-popup/success-popup.component';
// import { ExcelServiceService } from 'src/app/core/services/excel-service.service';

type AccordionKey = 'isPolicyAccordionOpen' | 'isGridAccordionOpen';
@Component({
  selector: 'app-group-renewal-do-home',
  templateUrl: './group-renewal-do-home.component.html',
  styleUrls: ['./group-renewal-do-home.component.scss']
})
export class GroupRenewalDoHomeComponent implements OnInit{
  isAccordionOpen:boolean=true;
  localStorageData: any;
  ReturnURL: any;
  loginData: any;
  formData: any;
  username: any;
  userRole: any;
  adminuserRole: any;
  userRoleData: any;
  groupRenewalFormCheck!: FormGroup;
  dispositionOptions: any;
  subDispositionOptions: any;
  loading = false;
  leadId: any;
  submitted: boolean = false;
  isButtonDisabled: boolean = true;
  allArray:any[] =[];
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
DispositionOption=['Link Triggered','Policy Renewed','Renewed From Other Mode']
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  filteredArray: any
  retailRenewalForm!: FormGroup;
  accordionStates: { [key in AccordionKey]: boolean } = {
    isPolicyAccordionOpen: true,
    isGridAccordionOpen: true
  };
  userObj:any
  profileDetails: any;
  agentDesignation: any;
  agentCode:any;
  location:any;
  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private rugService: RugService,
    private toast: NgToastService
  ) { }
  async ngOnInit() {
    if (localStorage.getItem("currentUser") !== null) {
      this.localStorageData = localStorage.getItem("currentUser");
      this.loginData =  JSON.parse(this.localStorageData);
    }
    this.userObj = {
      currentUser: localStorage.getItem('agentCode')
    }
    this.loading = true;
    this.rugService.getRetailRenewalPhaseTwoLeads(this.userObj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data)
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
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
    // await this.apiService.postCall(environment.ENDPOINTS.RETAIL_GRID, this.userObj)
    // .subscribe(
    //   response => {
    //     this.loading = false;
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //         this.arr = response.retailProposalList;
    //         this.allArray = response.retailProposalList;
    //     }
    //     if (response.isSuccess == false && response.statusCode == 500) {
    //       this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     this.loading = false;
    //   });

    // this.route.queryParams.subscribe(params => {
    //   this.formData = decodeURIComponent(params['role']);
    //   // this.userRole = this.apiService.decryptUrlData(this.formData)
    //   // this.adminuserRole = this.apiService.decryptUrlData(this.formData)
    // });

    const reqData = {
      "agentCode": localStorage.getItem('agentCode')
    }

    this.agentCode = localStorage.getItem('agentCode')

    this.userRoleData = localStorage.getItem('userRenewalRole');
    this.userRole =  JSON.parse(this.userRoleData);
    this.retailRenewalForm = this.formBuilder.group({
      grplmdFrom: ['', Validators.pattern('^\d{4}-\d{2}-\d{2}$')],
      grplmdTo:['', Validators.pattern('^\d{4}-\d{2}-\d{2}$')],
      grpocccenter:[''],
      productTypeSelect:[''],
      grpoldcoi:[''],
      grpexistingcoi:[''],
      grdisposition:['']
      
    });
    this.groupRenewalFormCheck = this.formBuilder.group({
      renewalType: ['retail'],
      avId: [''],
      officerId: ['', Validators.required],
      location: ['', Validators.required],
      oldCOINumber: ['', Validators.required],
      mobileNumber: [''],
      renewalStatus: [''],
      disposition: [''],
      subDisposition: [''],
      remark: ['']
    });
    console.log(this.groupRenewalFormCheck)
    this.rugService.getProfileDetails(reqData).subscribe((res: any) => {
      if (res.isSuccess) {
        this.profileDetails = res.data;
        this.agentDesignation = res.data.designation
      
        localStorage.setItem("designation", res.data.designation);
        localStorage.setItem("location", res.data.branchOfficeName); 
        this.location =  res.data.branchOfficeName
        this.groupRenewalFormCheck.patchValue({
          avId: this.agentCode,
          officerId: this.agentCode,
          location: this.location,
        })
      }
    });
    this.setConditionalValidators(this.userRole);
    // this.authService.sharedData$.subscribe((value: any) => {
    //   this.loginData = value;
    //   if(Utility.isEmptyObject(this.loginData)){
    //     if (localStorage.getItem("currentUser") !== null) {
    //       this.localStorageData = localStorage.getItem("currentUser");
    //       this.loginData =  JSON.parse(this.localStorageData);
    //     }
    //   }

      
    // })

    this.rugService.getDispositionsRenewal().subscribe({
      next: (res: any) => {
        console.log(res)
        res = JSON.parse(res.data).data
        console.log(res);
        this.dispositionOptions = res.allDisposition;         
      },
      error: (err) => {
        console.error(err);
      }
    });
    // await this.apiService.getApiCall(environment.ENDPOINTS.RENEWAL_GET_ALL_DISPOSITION).subscribe(
    //   (response: any) => {
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //       this.dispositionOptions = response.allDisposition;
    //     }
    //   },
    //   (error: any) => {
    //     console.error('Error fetching master data:', error);
    //   }
    // );

  }
  setConditionalValidators(role: any) {
    const controls = [
      { control: this.groupRenewalFormCheck.get('avId'), condition: role != 'group' },
      { control: this.groupRenewalFormCheck.get('mobileNumber'), condition: role != 'group' },
      { control: this.groupRenewalFormCheck.get('disposition'), condition: role == 'group' },
      { control: this.groupRenewalFormCheck.get('subDisposition'), condition: role == 'group' }
    ];
  
    controls.forEach(({ control, condition }) => {
      if (condition) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }
  changeRenewalType(event: any){
    let selectedPolicyType = event.target.value;
    this.userRole = event.target.value;
    this.setConditionalValidators(selectedPolicyType);
  }
  toggleAccordion(accordionName: AccordionKey) {
    this.accordionStates[accordionName] = !this.accordionStates[accordionName];
  }
  async checKPolicyStatus(event: any){
    this.isButtonDisabled = true;
    console.log(event.target.value);
    console.log(this.userRole);

    if(this.agentDesignation == 'RenewalGroup'){
      this.groupRenewalFormCheck.patchValue({
        disposition: "",
        subDisposition: ""
      })
      this.loading = true;
      //GHI-71-23-3635380-000
      //GHI-HB-22-2005177-003
      //GHI-71-24-0013306-000
      let reqObj = {
        certificate_number: event.target.value,
      }
      this.rugService.checkGroupRenewalData(reqObj).subscribe({
        next: (res: any) => {
          console.log(res);
          res = JSON.parse(res.data)
          console.log(res);
          if (res.isSuccess == true && res.statusCode == 200) {
            res = res.data
                    this.groupRenewalFormCheck.patchValue({
                      renewalStatus: res.renewalStatus,
                    })
                    this.leadId = res.leadId
                  }
                  if (res.isSuccess == false && res.statusCode == 500) {
                    if(res.groupRenewalData.error.length > 0 ){
                      this.toast.warning({ detail: "Warning", summary: res.groupRenewalData.error[0].errorMessage, duration: 5000 });
                      // this.toastr.warning(response.groupRenewalData.error[0].errorMessage, '', { timeOut: 5000 });
                    }
                    // this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
                  }

        },
        error: (err) => {
          console.error(err);
        }
      });
      // await this.apiService.postRenewalCall(environment.ENDPOINTS.CHECK_RENEWAL_STATUS, reqObj)
      //   .subscribe(
      //     response => {
      //       this.loading = false;
      //       if (response.isSuccess == true && response.statusCode == 200) {
      //         this.groupRenewalFormCheck.patchValue({
      //           renewalStatus: response.renewalStatus,
      //         })
      //         this.leadId = response.leadId
      //       }
      //       if (response.isSuccess == false && response.statusCode == 500) {
      //         if(response.groupRenewalData.error.length > 0 ){
      //           // this.toastr.warning(response.groupRenewalData.error[0].errorMessage, '', { timeOut: 5000 });
      //         }
      //         // this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
      //       }
      //     },
      //     error => {
      //       console.log(error);
      //       this.loading = false;
      //     });
    }else{
      this.groupRenewalFormCheck.patchValue({
        renewalStatus: "",
        mobileNumber: ""
      })
    }
  }
  async checKRetailPolicyStatus(event: any){
 
    //   if (localStorage.getItem("agentCode") !== null) {
    //     this.localStorageData = localStorage.getItem("currentUser");
    //     this.loginData =  JSON.parse(this.localStorageData);
    //   }

    this.loading = true;
    let reqObj = {
      policyNumber: this.groupRenewalFormCheck.get('oldCOINumber')?.value,  
      mobileNumber: event.target.value,  
      currentDo: this.agentCode,   
      center: this.groupRenewalFormCheck.get('location')?.value,
    }
    this.rugService.getRetailRenewalRedirectUrl(reqObj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data)
        console.log(res);
          if (res.isSuccess == true && res.statusCode == 200) {
            this.groupRenewalFormCheck.patchValue({
              renewalStatus: res.renewalStatus,
            })
            if(res.renewalStatus == "Open for renewal"){
              this.isButtonDisabled = false;
            }
            this.leadId = res.leadId
          }
          if (res.isSuccess == false && res.statusCode == 500) {
            this.groupRenewalFormCheck.patchValue({
              renewalStatus: res.renewalStatus == null ? "" : res.renewalStatus,
            })
            this.isButtonDisabled = true;
            this.toast.warning({ detail: "Warning", summary: res.errorMessage, duration: 5000 });
            // this.toast.warning(res.errorMessage, '', { timeOut: 5000 });
          }
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
  async changeDisposition(event: any) {
    // console.log(event.target.value);
    let selectedValue;
    if (typeof (event) === "object") {
      selectedValue = event.target.value;

    } else {
      selectedValue = event;
    }
    let reqbody = {
      dispositionId: selectedValue
    }
    this.loading = true;
    this.rugService.getAllSubDispositions(reqbody).subscribe({
      next: (res: any) => {
        res = JSON.parse(res.data)
        console.log(res)
        if (res.isSuccess == true && res.statusCode == 200) {
          res = res.data
                this.subDispositionOptions = res.allSubDisposition
                
          }
      },
      error: (err) => {
        console.error(err);
      }
    });
    // await this.apiService.postCall(
    //   environment.ENDPOINTS.GET_ALL_SUB_DISPOSITION,
    //   reqbody
    // ).subscribe(
    //   (response: any) => {
    //     this.loading = false;
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //       this.subDispositionOptions = response.allSubDisposition
          
    //     }
    //   },
    //   (error: any) => {
    //     this.loading = false;
    //     console.error('Error fetching master data:', error);
    //   }
    // );
  }
  getDispositionName(dispositionId: any): any {
    const disposition = this.dispositionOptions.find((d: any) => d.dispositionId == dispositionId);
    return disposition ? disposition.dispositionName : 'Unknown';
  }
  getSubDispositionName(subDispositionId: any): any {
    const subDisposition = this.subDispositionOptions.find((d: any) => d.subDispositionId == subDispositionId);
    return subDisposition ? subDisposition.subDispositionName : 'Unknown';
  }
  async sendRenewalLink(){
    if(this.groupRenewalFormCheck.get('renewalStatus')?.value != "Open for renewal"){
      this.toast.warning({ detail: "Warning", summary: this.groupRenewalFormCheck.get('renewalStatus')?.value, duration: 5000 });
      return;
    }
    this.submitted = true;
    let linkObj = {
      leadId: this.leadId,
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
  async onSubmit(){
    if(this.groupRenewalFormCheck.get('renewalStatus')?.value != "Open for renewal"){
      this.toast.warning({ detail: "Warning", summary: this.groupRenewalFormCheck.get('renewalStatus')?.value, duration: 5000 });
      return;
    }
    this.submitted = true;
    let renewalObj = {
      leadId: this.leadId,
      disposition: this.getDispositionName(this.groupRenewalFormCheck.get('disposition')?.value),
      subDispositon: this.getSubDispositionName(this.groupRenewalFormCheck.get('subDisposition')?.value),
      remarks: this.groupRenewalFormCheck.get('remark')?.value,
      currentUser: this.loginData?.userName
    }
    this.loading = true;
    this.rugService.SaveRenewalProposalData(renewalObj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data)
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
          this.router.navigate(['rug/group_renewal_modify_view/'+ this.leadId]);
                }
        if (res.isSuccess == false && res.statusCode == 500) {
          if(res.groupRenewalData.error.length > 0 ){
            this.toast.warning({ detail: "Warning", summary: "something wrong", duration: 5000 });
            // this.toastr.warning(response.groupRenewalData.error[0].errorMessage, '', { timeOut: 5000 });
          }
          // this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
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
  async saveAndRedierct(){
    this.submitted = true;
    console.log(this.groupRenewalFormCheck.valid);
    if(!this.groupRenewalFormCheck.valid){
      return;
    }
    if(this.groupRenewalFormCheck.get('renewalStatus')?.value != "Open for renewal"){
      // this.toastr.warning(this.groupRenewalFormCheck.get('renewalStatus')?.value, '', { timeOut: 5000 });
      return;
    }
    let retailObj = {
      leadId: this.leadId,  //which is passed on above api get response leadid
      isRenewal: true //Always true
    }
    if(this.groupRenewalFormCheck.valid){
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
                this.rugService.getRetailRenewalPhaseTwoLeads(this.userObj).subscribe({
                  next: (res: any) => {
                    console.log(res);
                    res = JSON.parse(res.data)
                    console.log(res);
                    if (res.isSuccess == true && res.statusCode == 200) {
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
      // .subscribe(
      //   response => {
      //     this.loading = false;
      //     if (response.isSuccess == true && response.statusCode == 200) {
      //       // window.location.href = response.redirectUrl;
      //       // window.open(response.redirectUrl);
      //       const dialogRef = this.dialog.open(SuccessPopupComponent, {
      //         width: "500px",
      //         autoFocus: false,
      //         data: response.statusMessage
      //       });
      //       dialogRef.afterClosed().subscribe((result: any) => {
      //         console.log(result);
      //         this.apiService.postCall(environment.ENDPOINTS.RETAIL_GRID, this.userObj)
      //         .subscribe(
      //           response => {
      //             this.loading = false;
      //             if (response.isSuccess == true && response.statusCode == 200) {
      //                 this.arr = response.retailProposalList;
      //                 this.allArray = response.retailProposalList;
      //             }
      //             if (response.isSuccess == false && response.statusCode == 500) {
      //               this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
      //             }
      //           },
      //           error => {
      //             console.log(error);
      //             this.loading = false;
      //           });
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
  }



  onSelect(event:any){
    this.itemsPerPage = event.target.value;
  }

  onInput(event:any){
    this.searchTerm = event.target.value
    this.currentPage = 1
    this.arr = this.arr.filter((option:any) =>
      option?.occCenter?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.currentStatus?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.custName?.toLowerCase().includes(this.searchTerm.toLowerCase())
  ||  option?.productName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || option?.proposalId?.toLowerCase().includes(this.searchTerm.toLowerCase())
    || option?.oldPolicyNumber?.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
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

  flterBetweenDates(event:any){
    if(this.retailRenewalForm.get('grplmdFrom')?.invalid && this.retailRenewalForm.get('grplmdTo')?.invalid){
    // const start = new Date(this.retailRenewalForm.get('grplmdFrom')?.value);
    // const end = new Date(this.retailRenewalForm.get('grplmdTo')?.value);
    // this.arr = Utility.filterByDateRange(this.arr, this.convertDateFormat(this.retailRenewalForm.get('grplmdFrom')?.value), this.convertDateFormat(this.retailRenewalForm.get('grplmdTo')?.value));
    this.currentPage = 1
    }


  }
   convertDateFormat(dateStr:any) {
    // Parse the date string into components
    const [year, month, day] = dateStr.split('-').map(Number);

    // Format the date components into 'MM-DD-YYYY'
    const formattedDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;
    return formattedDate;
}


  clearFilter(){
    this.retailRenewalForm.reset()
    this.arr = this.allArray
   
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

  exportToxl(){
    // this.excelService.exportAsExcelFile(this.arr, 'Retail_Leads')
  }
}
