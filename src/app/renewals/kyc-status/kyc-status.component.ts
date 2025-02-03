import { Component } from '@angular/core';
import { RenewalsService } from '../renewals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { payment } from 'src/assets/styles/renewals-forms/payment';
import { thankYou } from 'src/assets/styles/renewals-forms/combined_forms';

@Component({
  selector: 'app-kyc-status',
  templateUrl: './kyc-status.component.html',
  styleUrls: ['./kyc-status.component.scss']
})
export class KycStatusComponent {

  kycStatus: string | undefined;
  transactionId:string | undefined;
  
  constructor(private route: ActivatedRoute,private renewalService: RenewalsService,
    private router: Router,private encryptionService: EncryptionService,private toast: NgToastService) { 
  }

  ngOnInit() {    
    const params = this.route.snapshot.queryParams;
    if (Object.keys(params).length) {
      if (params['token']) {
        localStorage.setItem('token', params['token']); 
      }
      this.transactionId = params['transactionId'];
    }
    if (!this.transactionId) {
      console.error('Order ID is missing');
      return;
    }
    this.getKycStatus();
  }
  
    getKycStatus() {  
      const kycDetailsReq = {
        transactionId :  this.transactionId,
        businessType : "REN",
        userType: ""
      }
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        (res: any) => {
          console.log(res);
          
          if (res.data.kycStatus) {
            const kycData = res.data;
            const renewalInfoRequestBody = {
              policy_Number: res.data.policyNumber,
            };
            this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
              (res: any) => {
                const formData = res.data;     
                if (kycData.kycStatus) {
                  console.log("kycStatue" , res.data.kycStatus);
                  formData.isKycCompleted=true;
                  this.router.navigate(['renewal/renewalJourney'], {
                    state: {
                      formData: this.encryptionService.encrypt(formData),
                      proposalNum: this.encryptionService.encrypt(""),
                      policyNumber: this.encryptionService.encrypt(res.data.policyNumber),
                      journeyProcess: this.encryptionService.encrypt(0),
                      formSequence: this.encryptionService.encrypt([payment, thankYou]),
                      kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
                      formIndex: "0",
                    }
                  });
                } else if (!kycData.kycStatus) {
                  this.router.navigate(['renewal/renewalJourney'], {
                    state: {
                      formData: this.encryptionService.encrypt(formData),
                      proposalNum: this.encryptionService.encrypt(""),
                      policyNumber: this.encryptionService.encrypt(res.data.policyNumber),
                      journeyProcess: this.encryptionService.encrypt(0),
                      formSequence: this.encryptionService.encrypt([payment, thankYou]),
                      kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
                      formIndex: "0",
                    }
                  });
                } else {
                  this.router.navigate(['renewal/renewalList']);
                }
              },
              (err) => {
                console.error("Error from getRenewalInfo API:", err);
                this.toast.error({ detail: "Error", summary: "Error while getting renewal Information.", duration: 3000 });
              }
            );      
          } else {
            this.toast.error({ detail: 'Error', summary: res.message || "Failed to do Payment", duration: 3000 });
          }
        },
        (err) => {
          this.toast.error({ detail: 'Error', summary: 'Failed to do kyc.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );
    }
}
