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
      if (Object.keys(this.route.snapshot.queryParams).length) {
        const params = this.route.snapshot.queryParams;
        this.transactionId = params['transactionId'];

      }
      this.getKycStatus();

    }  

    // https://usp.monocept.ai/Quote/api/CallBackforKYC?transactionId=UP_241213_ae7c3695&status=auto_approved

    getKycStatus() {  
      const kycDetailsReq = {
        "transactionId":  this.transactionId
      }
  
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        (res: any) => {
          if (res.kycStatus) {
            const kycData = res.data;
            const renewalInfoRequestBody = {
              // policy_Number: proposerDetail.policyNumber,
            };
            this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
              (res: any) => {
                const formData = this.encryptionService.encrypt(res.data);
                // this.formData.isKYCComplete=kycData.kycStatus;
                // this.formData.ckycNo = kycData.kycNumber;
                if (kycData.paymentStatus == 'SUCCESS') {
                  console.log('inside success');
                  this.router.navigate(['renewal/renewalJourney'], {
                    state: {
                      formData: this.encryptionService.encrypt(kycData.orderDetails),
                      proposalNum: this.encryptionService.encrypt(kycData.orderDetails.proposalNumber),
                      policyNumber: this.encryptionService.encrypt(kycData.orderDetails.policyNumber),
                      journeyProcess: this.encryptionService.encrypt(0),
                      formSequence: this.encryptionService.encrypt([payment, thankYou]),
                      formIndex: "2",
                    }
                  });
                } else if (kycData.paymentStatus == 'FAILED') {
                  console.log('inside failed');
                  this.router.navigate(['renewal/renewalJourney'], {
                    state: {
                      formData: this.encryptionService.encrypt(kycData.orderDetails),
                      proposalNum: this.encryptionService.encrypt(kycData.orderDetails.proposalNumber),
                      policyNumber: this.encryptionService.encrypt(kycData.orderDetails.policyNumber),
                      journeyProcess: this.encryptionService.encrypt(0),
                      formSequence: this.encryptionService.encrypt([payment, thankYou]),
                      formIndex: "2",
                    }
                  });
                } else if (kycData.paymentStatus == 'INPROGRESS') {
                  console.log('InProgress');
                  this.router.navigate(['renewal/renewalList']);
                }
              },
              (err) => {
                console.error("Error from getRenewalInfo API:", err);
                this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
              }
            );
            console.log(res.data);
      
          } else {
            this.toast.error({ detail: '', summary: res.message || "Failed to do Payment", duration: 3000 });
          }
        },
        (err) => {
          this.toast.error({ detail: '', summary: 'Failed to do online payment.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );
    }
}
