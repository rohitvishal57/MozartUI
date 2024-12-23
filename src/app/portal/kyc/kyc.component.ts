import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { RenewalsService } from 'src/app/renewals/renewals.service';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { kycThankYou, thankYou } from 'src/assets/styles/renewals-forms/combined_forms';
import { customer_payment } from 'src/assets/styles/renewals-forms/customer_payment';
import { payment } from 'src/assets/styles/renewals-forms/payment';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent {

  kycStatus: string | undefined;
  transactionId:string | undefined;
  user:string| undefined;
  userModule:string|undefined;
  params:any= {}
  agentCode!: string | null;
  quickQuoteRedirect!: boolean;
  formSequence: any;
  form: any;
  
  constructor(private route: ActivatedRoute,private renewalService: RenewalsService,
    private router: Router,private encryptionService: EncryptionService,private toast: NgToastService,
  private commonService: CommonService,private yatraService: YatraService) { 
  }

  ngOnInit() {   
    debugger; 
    if (Object.keys(this.route.snapshot.queryParams).length) {
       this.params = this.route.snapshot.queryParams;
      this.user = this.params.userType;
      this.transactionId = this.params['transactionId'] ? this.params['transactionId'] : "";
      if (this.params['token']) {
        localStorage.setItem('token', this.params['token']); 
      }
    }
    // this.user='Customer';
    // this.userModule='yatra';
    // this.transactionControl();
    this.redirectFunction();
  }
 
  // transactionControl(){
  //   if(this.user == 'Customer'){
  //     if(this.userModule == 'renewal'){
  //       this.router.navigate(['renewal/customerKyc'], {
  //         state: {
  //           // formData: this.encryptionService.encrypt(),
  //           formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
  //           // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
  //         }
  //       });
  //     }else if(this.userModule == 'yatra'){
  //       this.router.navigate(['yatra/customerKyc'], {
  //         state: {
  //           // formData: this.encryptionService.encrypt(),
  //           formSequence: this.encryptionService.encrypt([customer_payment,thankYou]),
  //           // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
  //         }
  //       });

  //     }else{

  //     }
  //   }else if(this.user == 'Agent'){
  //     if(this.userModule == 'renewal'){
  //       this.router.navigate(['renewal/kycStatus'], {
  //         queryParams: {
  //           transactionId: 'UP_241216_15e4ee15',
  //           token: 'aa59deee594c4c90abd5737929d0302e'
  //         }
  //       });

  //     }else if(this.userModule == 'yatra'){
  //       this.router.navigate(['yatra'], {
  //         state: {
  //           // formData: this.encryptionService.encrypt(),
  //           // formSequence: this.encryptionService.encrypt([]),
  //           // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
  //         }
  //       });

  //     }else{

  //     }
  //   }else{

  //   }

  // }
  redirectFunction(){
    if (this.user == 'Agent') {
      if(this.params.businessType == 'NB'){
      const kycDetailsReq = {
        "transactionId": this.params.transactionId,
        "businessType": this.params.businessType,
        "userType": this.user
      }
      console.log(kycDetailsReq);
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        async (res: any) => {
          const kycData = res.data;
          const reqData = {
            "partnerId": kycData.partnerId,
            "productId": kycData.productId
          }
          const sequence = await firstValueFrom(this.commonService.Getformsequence(reqData));
          console.log(sequence);
          this.formSequence = JSON.parse(sequence.data.formSequence);
          const formId = this.getFormIndexValue();
          const Data = {
            verifyKYC: res.data.kycStatus
          };
          const requset = {
            partnerId: kycData.partnerId.toString(),
            productId: kycData.productId.toString(),
            formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue()].formId.toString(),
            proposalNum: "",
            agentCode: this.agentCode,
            leadId: this.quickQuoteRedirect == false ? '' : kycData.leadId,
            isLead: this.quickQuoteRedirect == false ? false : true,
            currentFormSequence: ""
          }
      
          console.log(requset);
      
          await this.yatraService.Getform(requset).subscribe({
            next:  async (res: any) => {
              console.log(res);
              this.form = JSON.parse(res.data.jsonFormData);
              console.log(this.form);
              const requestData = {
                "proposalNum": kycData.proposalNumber,
                "partnerId": kycData.partnerId,
                "agentCode": this.agentCode,
                "formData": JSON.stringify(Data),
                "formName": this.formSequence[this.getFormIndexValue()].formName,
                "formConfig": JSON.stringify(this.formSequence),
                "productId": kycData.productId.toString(),
                "formId": this.formSequence[this.getFormIndexValue()].formId,
                "jsonForm": JSON.stringify(this.form),
                "formSequence": this.getFormIndexValue(),
                "leadNumber": kycData.leadId,
                "quoteNumber": ""
              };
        
              console.log(requestData);
        
              await this.yatraService.Insertorupdateformdata(requestData).subscribe({
                next: (res: any) => {
                  console.log(res);
                  // Call getFormDataFromFormSequence only after insert/update is complete
                  if (kycData.kycStatus == "True") {
                    // const renewalInfoRequestBody = {
                    //   proposalNum: res.data.proposalNumber,
                    // };
                    // this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
                    //   (res: any) => {
                    this.agentCode = localStorage.getItem('agentCode');
                    const reqData = {
                      partnerId: kycData.partnerId,
                      productId: kycData.productId,
                      formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue()].formId.toString(),
                      proposalNum: kycData.proposalNumber,
                      agentCode: this.agentCode,
                      currentFormSequence: this.getFormIndexValue().toString(),
                      leadId: kycData.leadId,
                      verifyKyc: true
                    }
                    // localStorage.setItem("formIndex", kycData.formSequence.toString());
                    const encodedEncryptedData = this.encryptionService.encrypt(reqData);
        
                    this.router.navigate(['yatra'], {
                      queryParams: { data: encodedEncryptedData }
                    });
        
                  }
                  else {
                    this.agentCode = localStorage.getItem('agentCode');
                    const reqData = {
                      partnerId: kycData.partnerId,
                      productId: kycData.productId,
                      formId: "5",
                      proposalNum: kycData.proposalNumber,
                      agentCode: "5000013",
                      currentFormSequence: "7",
                      leadId: this.quickQuoteRedirect == false ? '' : kycData.leadId,
                      isLead: this.quickQuoteRedirect == false ? false : true,
                      verifyKyc: false
                    }
                    localStorage.setItem("formIndex", "7");
                    const encodedEncryptedData = this.encryptionService.encrypt(reqData);
        
                    this.router.navigate(['yatra'], {
                      queryParams: { data: encodedEncryptedData }
                    });
                    this.toast.error({ detail: '', summary: res.message || "Failed to do Payment", duration: 3000 });
                  }
                },
                error: (err) => {
                  console.error(err);
                }
              });
            },
            error: (err) => {
              console.log(err);
            }
          });
          // if (res.data.kycStatus == "True") {
          //   // const renewalInfoRequestBody = {
          //   //   proposalNum: res.data.proposalNumber,
          //   // };
          //   // this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
          //   //   (res: any) => {
          //   this.agentCode = localStorage.getItem('agentCode');
          //   const reqData = {
          //     partnerId: kycData.partnerId,
          //     productId: kycData.productId,
          //     formId: this.formSequence.length == 0 ? "0" : this.formSequence[this.getFormIndexValue()].formId.toString(),
          //     proposalNum: kycData.proposalNumber,
          //     agentCode: this.agentCode,
          //     currentFormSequence: this.getFormIndexValue().toString(),
          //     leadId: kycData.leadId,
          //     verifyKyc: true
          //   }
          //   // localStorage.setItem("formIndex", kycData.formSequence.toString());
          //   const encodedEncryptedData = this.encryptionService.encrypt(reqData);

          //   this.router.navigate(['yatra'], {
          //     queryParams: { data: encodedEncryptedData }
          //   });

          // }
          // else {
          //   this.agentCode = localStorage.getItem('agentCode');
          //   const reqData = {
          //     partnerId: kycData.partnerId,
          //     productId: kycData.productId,
          //     formId: "5",
          //     proposalNum: kycData.proposalNumber,
          //     agentCode: "5000013",
          //     currentFormSequence: "7",
          //     leadId: this.quickQuoteRedirect == false ? '' : kycData.leadId,
          //     isLead: this.quickQuoteRedirect == false ? false : true,
          //   }
          //   localStorage.setItem("formIndex", "7");
          //   const encodedEncryptedData = this.encryptionService.encrypt(reqData);

          //   this.router.navigate(['yatra'], {
          //     queryParams: { data: encodedEncryptedData }
          //   });
          //   this.toast.error({ detail: '', summary: res.message || "Failed to do Payment", duration: 3000 });
          // }
        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do kyc.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );
    }else if(this.params.businessType == 'REN'){
      const kycDetailsReq = {
        "transactionId": this.params.transactionId,
        "businessType": this.params.businessType,
        "userType": this.user
      }
      console.log(kycDetailsReq);
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        async (res: any) => {
          if (res.data.kycStatus == "True") {
            this.agentCode = localStorage.getItem('agentCode');
            const renewalInfoRequestBody = { policy_Number: res.data.policyNumber };
            try {
              const resInfo: any = await firstValueFrom(this.renewalService.getRenewalInfoApi(renewalInfoRequestBody));
              const updatedData = {
                ...resInfo.data,
                isKycCompleted: Boolean(res.data.kycStatus),
              };
              this.toast.success({detail: "SUCCESS",summary: "KYC SUCCESS",duration: 5000});
              this.router.navigate(['renewal/renewalJourney'], {
                state: {
                  formData: this.encryptionService.encrypt(updatedData),
                  proposalNum: this.encryptionService.encrypt(""),
                  policyNumber: this.encryptionService.encrypt(res.data.policyNumber),
                  journeyProcess: this.encryptionService.encrypt(0),
                  formSequence: this.encryptionService.encrypt([payment, thankYou]),
                  kycStatus: this.encryptionService.encrypt(res.data.kycStatus),
                  formIndex: "0",
                },
              });
            } catch (err) {
              console.error("Error from getRenewalInfo API:", err);
              this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
            }
          }else if (res.data.kycStatus == "false")  {
            this.agentCode = localStorage.getItem('agentCode');
            const renewalInfoRequestBody = { policy_Number: res.data.policyNumber };
            const resInfo: any = await firstValueFrom(this.renewalService.getRenewalInfoApi(renewalInfoRequestBody));
            this.toast.error({detail: "UNSUCCESS",summary: "KYC UNSUCCESS",duration: 5000});
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(resInfo.data),
                proposalNum: this.encryptionService.encrypt(""),
                policyNumber: this.encryptionService.encrypt(res.data.policyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([payment, thankYou]),
                kycStatus: this.encryptionService.encrypt(res.data.kycStatus),
                formIndex: "0",
              }
            });

          }

        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do kyc.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );

    }
    }
    else if(this.user == 'Customer'){
      if(this.params.businessType == 'NB'){

      const kycDetailsReq = {
        "transactionId": this.params.transactionId,
        "businessType": this.params.businessType,
        "userType": this.user
      }
      console.log(kycDetailsReq);
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        async (res: any) => {
          console.log(res);
          const kycData = res.data;
          this.router.navigate(['yatra/customerKyc'], {
            state: {
              formData: this.encryptionService.encrypt(kycData),
              formSequence: this.encryptionService.encrypt([kycThankYou]),
              kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            }
          });
        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do kyc.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );
    }else if(this.params.businessType == 'REN'){

      const kycDetailsReq = {
        "transactionId": this.params.transactionId,
        "businessType": this.params.businessType,
        "userType": this.user
      }
      console.log(kycDetailsReq);
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        async (res: any) => {
          console.log(res);
          const kycData = res.data;
          this.toast.success({detail: "SUCCESS",summary: "KYC SUCCESS",duration: 5000});
          this.router.navigate(['renewal/customerKyc'], {
            state: {
              // formData: this.encryptionService.encrypt(),
              formSequence: this.encryptionService.encrypt([kycThankYou]),
              kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            }
          });
        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do kyc.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );
  }
}
  }
  getFormIndexValue() {
    const formIndex = localStorage.getItem("formIndex") as string;
    return formIndex ? parseInt(formIndex, 10) : 0;
  }

}
