import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RugService } from '../rug.service';
import { NgToastService } from 'ng-angular-popup';
import { SuccessErrorModalComponent } from 'src/app/shared/components/success-error-modal/success-error-modal.component';


// Define the type for the accordion keys
type AccordionKey = 'isPolicyAccordionOpen' | 'isMemberAccordionOpen' | 'isCustomerAccordionOpen' | 'isPremiumAccordionOpen' | 'isNomineeAccordionOpen' | 'isDispositionAccordionOpen' | 'isDeclarationAccordionOpen';
@Component({
  selector: 'app-group-renewal-modify-view',
  templateUrl: './group-renewal-modify-view.component.html',
  styleUrls: ['./group-renewal-modify-view.component.scss']
})
export class GroupRenewalModifyViewComponent implements OnInit{
  // Accordion states
  accordionStates: { [key in AccordionKey]: boolean } = {
    isPolicyAccordionOpen: true,
    isMemberAccordionOpen: true,
    isCustomerAccordionOpen: true,
    isPremiumAccordionOpen: true,
    isNomineeAccordionOpen: true,
    isDispositionAccordionOpen: true,
    isDeclarationAccordionOpen: true
  };
  policyDetailsForm!: FormGroup;
  policyData: any;
  leadId: any;
  loading = false;
  dispositionOptions: any;
  subDispositionOptions: any;
  plans: any;
  submitted: boolean = false;  
  loginData: any;
  localStorageData: any;
  constructor( private dialog: MatDialog,private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private rugService: RugService,
     private toast: NgToastService
  ) { }
  async ngOnInit() {
    // this.policyData= renewalResponse_latest.response;
    // console.log(this.policyData);
    if (localStorage.getItem("currentUser") !== null) {
      this.localStorageData = localStorage.getItem("currentUser");
      this.loginData =  JSON.parse(this.localStorageData);
    }
    this.route.paramMap.subscribe(params => {
      this.leadId = params.get('leadId');
    });
    this.policyDetailsForm = this.fb.group({
      anyClaimReported: [''],
      anyChronicHistory: [''],
      policyDetails: this.fb.group({
        existingMasterPolicyNumber: [''],
        existingCOI: [''],
        proposalNo: [''],
        existingCOIStartDate: [''],
        existingCOIEndDate: [''],
        leadId: [''],
        productName: [''],
        renewedMasterPolicyNo: [''],

      }),
      customerDetails: this.fb.group({
        salutation: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        dob: ['', Validators.required],
        mobileNumber: ['', Validators.required],
        emailId: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pincode: ['', [Validators.required]],
        nri: ['', [Validators.required]],
        tenure: ['', [Validators.required]],
        occupation: ['', [Validators.required]],
        annualIncome: ['', [Validators.required]],
      }),
      memberDetails: this.fb.group({
        sumInsured: ['', [Validators.required]],
        familyConstruct: ['', [Validators.required]],
        members: this.fb.array([this.createMember()])
      }),
      premiumDetails: this.fb.group({

        oldPolicyPremium: ['', Validators.required],
        totalHealthReturns: ['', Validators.required],
        renewalPremium: ['', Validators.required],
        renewalPremiumToPay: ['', Validators.required],
        includeHealthReturns: ['', Validators.required],
        excludeHealthReturns: [''],
      }),
      nomineeDetails: this.fb.group({
        relationWithProposer: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        contactNo: ['', Validators.required],
      }),
      dispositionDetails: this.fb.group({
        disposition: ['', Validators.required],
        subDisposition: ['', Validators.required],
        remarks: ['', Validators.required],
      }),
      declarationDetails: this.fb.group({
        declaration: [false, this.checkboxRequiredValidator()]
      })
    });
    let leadObj = {
      leadId: this.leadId,
    }
    this.loading = true;
     this.rugService.getRenewalPolicyData(leadObj).subscribe({
          next: (res: any) => {
            console.log(res);
            res = JSON.parse(res.data)
            console.log(res);
              if (res.isSuccess == true && res.statusCode == 200) {
                res = res.data
          this.policyData = res.renewalPolicyData;
          this.plans = this.policyData.policyDetailsInList.map((item: any) => item.certificateNumber.substring(0, 3));
          this.patchFormValues();
              }
              if (res.isSuccess == false && res.statusCode == 500) {
                this.toast.warning({ detail: "Warning", summary: res.errorMessage, duration: 5000 });
              }
    
          },
          error: (err) => {
            console.error(err);
          }
        });
    // await this.apiService.postRenewalCall(environment.ENDPOINTS.GET_RENEWAL_POLICY_DATA, leadObj)
    // .subscribe(
    //   response => {
    //     this.loading = false;
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //       this.policyData = response.renewalPolicyData;
    //       this.plans = this.policyData.policyDetailsInList.map((item: any) => item.certificateNumber.substring(0, 3));
    //       this.patchFormValues();
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     this.loading = false;
    //   });
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
    //   await this.apiService.getApiCall(environment.ENDPOINTS.RENEWAL_GET_ALL_DISPOSITION).subscribe(
    //     (response: any) => {
    //       if (response.isSuccess == true && response.statusCode == 200) {
    //         this.dispositionOptions = response.allDisposition;
    //       }
    //     },
    //     (error: any) => {
    //       console.error('Error fetching master data:', error);
    //     }
    //   );
  }
  isPlanIncluded(value: any){
    if(this.plans != undefined){
      return this.plans.includes(value);
    }
    return false;
  }
  createMember(): FormGroup {
    return this.fb.group({
      salutation: [''],
      relationWithProposer: [''],
      firstName: [''],
      lastName: [''],
      gender: [''],
      dob: [''],
      age: [''],
      isChronicDisease: ['']
    });
  }
  get members(): FormArray {
    return this.policyDetailsForm.get('memberDetails')?.get('members') as FormArray;
  }
  patchFormValues(): void {
    const formData = {
      policyDetails: {
        existingMasterPolicyNumber: this.policyData?.policyDetails?.masterPolicyNumber,
        existingCOI: this.policyData?.policyDetails?.certificateNumber,
        proposalNo: this.policyData?.policyDetails?.proposalNumber,
        existingCOIStartDate: this.policyData?.policyDetails?.coiStartDate,
        existingCOIEndDate: this.policyData?.policyDetails?.coiEndDate,
        leadId: this.policyData?.policyDetails?.leadId,
        productName: this.policyData?.policyDetails?.productName,
        renewedMasterPolicyNo: this.policyData?.policyDetails?.masterPolicyNumber,
      },
      customerDetails: {
        salutation: this.policyData?.proposalDetails?.salutation,
        firstName: this.policyData?.proposalDetails?.firstName,
        lastName: this.policyData?.proposalDetails?.lastName,
        gender: this.policyData?.proposalDetails?.gender,
        dob: this.policyData?.proposalDetails?.dob,
        mobileNumber: this.policyData?.proposalDetails?.mobileNumber,
        emailId: this.policyData?.proposalDetails?.emailId,
        address: this.policyData?.proposalDetails?.address,
        city: this.policyData?.proposalDetails?.city,
        state: this.policyData?.proposalDetails?.state,
        pincode: this.policyData?.proposalDetails?.pincode,
        nri: this.policyData?.proposalDetails?.nri,
        tenure: this.policyData?.proposalDetails?.tenure,
        occupation: this.policyData?.proposalDetails?.occupation,
        annualIncome: this.policyData?.proposalDetails?.annualIncome,
      },
      memberDetails: {
        sumInsured: this.policyData?.proposalDetails?.sumInsured,
        familyConstruct: this.policyData?.proposalDetails?.familyConstruct, 
        members: [
        ]
      },
      premiumDetails: {
        oldPolicyPremium: this.policyData?.proposalDetails?.oldPolicyPremium,
        totalHealthReturns: this.policyData?.proposalDetails?.totalHealthReturn,
        renewalPremium: this.policyData?.proposalDetails?.renewalPremium,
        renewalPremiumToPay: this.policyData?.proposalDetails?.renewalPremiumToPay,
        includeHealthReturns: this.policyData?.proposalDetails?.isHealthInclude.toString(),
        excludeHealthReturns: this.policyData?.proposalDetails?.totalHealthReturn
      },
      nomineeDetails: {
        relationWithProposer: this.policyData?.nomineeDetails?.relationWithProposer,
        firstName: this.policyData?.nomineeDetails?.firstName,
        lastName: this.policyData?.nomineeDetails?.lastName,
        contactNo: this.policyData?.nomineeDetails?.contactNo,
      },
      dispositionDetails: {
        disposition: this.policyData?.proposalDetails?.disposition,  //this.getDispositionId(this.policyData?.proposalDetails?.disposition),this.policyData?.proposalDetails?.subDisposition
        subDisposition: this.policyData?.proposalDetails?.subDisposition,  //this.changeDisposition(this.getDispositionId(this.policyData?.proposalDetails?.disposition)),
        remarks: this.policyData?.proposalDetails?.remarks,
      },
      declarationDetails: {
        // declaration: 'I declare that all information is correct.'
      }
    };

    // Patch the form values
    this.policyDetailsForm.patchValue({
      anyClaimReported: this.policyData?.proposalDetails?.claimReportedInPreviousPolicy,
      anyChronicHistory: this.policyData?.proposalDetails?.pedChronicHistoryPast1Year,
      policyDetails: formData.policyDetails,
      customerDetails: formData.customerDetails,
      premiumDetails: formData.premiumDetails,
      nomineeDetails: formData.nomineeDetails,
      dispositionDetails: formData.dispositionDetails,
      declarationDetails: formData.declarationDetails
    });
    this.policyDetailsForm.get('memberDetails')?.patchValue({
      sumInsured: this.policyData?.proposalDetails?.sumInsured,
      familyConstruct: this.policyData?.proposalDetails?.familyConstruct, 
    })
    // Patch the member details separately
    this.members.clear(); // Clear existing members
    this.policyData.renewal_Members.forEach((obj: any) => {
      this.members.push(this.fb.group({
            salutation: obj.salutation,
            relationWithProposer: obj.relationWithProposer,
            firstName: obj.firstName,
            lastName: obj.lastName,
            gender: obj.gender,
            dob: obj.dob,
            age: obj.age,
            isChronicDisease: obj.chronicDisease
      }));
    });
    // formData.memberDetails.members.forEach(member => {
    //   this.members.push(this.fb.group(member));
    // });
  }
  addMember(): void {
    this.members.push(this.createMember());
  }

  removeMember(index: number): void {
    this.members.removeAt(index);
  }
  // Function to handle the accordions
  toggleAccordion(accordionName: AccordionKey) {
    this.accordionStates[accordionName] = !this.accordionStates[accordionName];
  }
  checkboxRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === true ? null : { required: true };
    };
  }
  async onSubmit(): Promise<void> {
    this.submitted = true;
    // console.log(this.policyDetailsForm.get('declarationDetails.declaration')?.value);
    if(!this.policyDetailsForm.get('declarationDetails.declaration')?.valid){
      return;
    }
    // console.log(this.policyDetailsForm.get('premiumDetails.excludeHealthReturns')?.value);
    let renewalObj = {
      leadId: this.leadId,
      disposition: this.policyDetailsForm.get('dispositionDetails.disposition')?.value,
      subDispositon: this.policyDetailsForm.get('dispositionDetails.subDisposition')?.value,
      remarks: "",
      claimReportedInPreviousPolicy: false,
      pedChronicHistoryPast1Year: false,
      isHealthInclude: this.policyDetailsForm.get('premiumDetails.includeHealthReturns')?.value == "true" ? true : false,
      currentUser: this.loginData?.userName
    }
    this.loading = true;
    this.rugService.SaveRenewalProposalData(renewalObj).subscribe({
      next: (res: any) => {
        console.log(res);
        res = JSON.parse(res.data)
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
        let linkObj = {
            leadId: this.leadId,
            isRenewal: true
          }
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
                      this.router.navigate(['renewal/srl_thankyou/'+ this.leadId]);
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
    // await this.apiService.postRenewalCall(environment.ENDPOINTS.SAVE_RENEWAL_PROPOSAL_DATA, renewalObj)
    // .subscribe(
    //   async response => {
    //     this.loading = false;
    //     if (response.isSuccess == true && response.statusCode == 200) {
    //       let linkObj = {
    //         leadId: this.leadId,
    //         isRenewal: true
    //       }
    //       this.loading = true;
    //       await this.apiService.postRenewalCall(environment.ENDPOINTS.SEND_LINK_TO_CUSTOMER, linkObj)
    //         .subscribe(
    //           response => {
    //             this.loading = false;
    //             if (response.isSuccess == true && response.statusCode == 200) {
    //               const dialogRef = this.dialog.open(SuccessPopupComponent, {
    //                 width: "500px",
    //                 autoFocus: false,
    //                 data: response.statusMessage
    //               });
    //               dialogRef.afterClosed().subscribe((result: any) => {
    //                 console.log(result);
    //                 this.router.navigate(['renewal/srl_thankyou/'+ this.leadId]);
    //               })
    //             }
    //             if (response.isSuccess == false && response.statusCode == 500) {
    //               this.toastr.warning(response.errorMessage, '', { timeOut: 5000 });
    //             }
    //           },
    //           error => {
    //             console.log(error);
    //             this.loading = false;
    //           });
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

  includeHealthReturn(event:any){
    let healthInclude = event.target.value
    if(healthInclude == 'true'){
      this.policyDetailsForm.get('premiumDetails')?.patchValue({
        // oldPolicyPremium: this.policyData?.proposalDetails?.oldPolicyPremium,
        // totalHealthReturns: this.policyData?.proposalDetails?.totalHealthReturn,
        // renewalPremium: this.policyData?.proposalDetails?.renewalPremium,
        renewalPremiumToPay: this.policyData?.proposalDetails?.renewalPremium - this.policyData?.proposalDetails?.totalHealthReturn,
        // includeHealthReturns: this.policyData?.proposalDetails?.isHealthInclude,
        // excludeHealthReturns: this.policyData?.proposalDetails?.totalHealthReturn
      })
    }else if(healthInclude == 'false'){
      this.policyDetailsForm.get('premiumDetails')?.patchValue({
        // oldPolicyPremium: this.policyData?.proposalDetails?.oldPolicyPremium,
        // totalHealthReturns: this.policyData?.proposalDetails?.totalHealthReturn,
        // renewalPremium: this.policyData?.proposalDetails?.renewalPremium,
        renewalPremiumToPay: this.policyData?.proposalDetails?.renewalPremiumToPay,
        // includeHealthReturns: this.policyData?.proposalDetails?.isHealthInclude,
        // excludeHealthReturns: this.policyData?.proposalDetails?.totalHealthReturn
      })
    }

  }
}
