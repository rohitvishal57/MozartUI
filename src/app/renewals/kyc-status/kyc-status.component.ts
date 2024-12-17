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
    console.log("redirection");
    
    const params = this.route.snapshot.queryParams;
  
    if (Object.keys(params).length) {
      this.transactionId = params['transactionId'];
      if (params['token']) {
        localStorage.setItem('token', params['token']); 
      } else {
        console.warn('Token not found in query parameters');
      }
    }
  
    if (!this.transactionId) {
      console.error('Order ID is missing');
      return;
    }
  
    console.log('Order ID:', this.transactionId);
    this.getKycStatus();
  }
  


    getKycStatus() {  
      const kycDetailsReq = {
        "transactionId":  this.transactionId
      }
  
      this.renewalService.getKycDetailsApi(kycDetailsReq).subscribe(
        (res: any) => {
          if (res.data.kycStatus) {
            const kycData = res.data;
            const renewalInfoRequestBody = {
              policy_Number: kycData.policyNumber,
            };
            this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
              (res: any) => {
                const formData = res.data;
                formData.isKYCComplete=kycData.kycStatus;
                formData.ckycNo = kycData.kycNumber;
                if (kycData.paymentStatus) {
                  this.router.navigate(['renewal/renewalJourney'], {
                    state: {
                      formData: this.encryptionService.encrypt(formData),
                      proposalNum: this.encryptionService.encrypt(kycData.orderDetails.proposalNumber),
                      policyNumber: this.encryptionService.encrypt(kycData.orderDetails.policyNumber),
                      journeyProcess: this.encryptionService.encrypt(0),
                      formSequence: this.encryptionService.encrypt([payment, thankYou]),
                      formIndex: "0",
                    }
                  });
                } else if (kycData.paymentStatus == 'FAILED') {
                  this.router.navigate(['renewal/renewalJourney'], {
                    state: {
                      formData: this.encryptionService.encrypt(kycData.orderDetails),
                      proposalNum: this.encryptionService.encrypt(kycData.orderDetails.proposalNumber),
                      policyNumber: this.encryptionService.encrypt(kycData.orderDetails.policyNumber),
                      journeyProcess: this.encryptionService.encrypt(0),
                      formSequence: this.encryptionService.encrypt([payment, thankYou]),
                      formIndex: "0",
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
          this.toast.error({ detail: '', summary: 'Failed to do kyc.', duration: 3000 });
          console.log("error is coming from fullquote api");
        }
      );
    }
}
