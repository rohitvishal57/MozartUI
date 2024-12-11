import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { LoadingService } from 'src/app/services/loading.service';
import { thankYou } from 'src/assets/styles/renewals-forms/combined_forms';
import { new_combinedForms } from 'src/assets/styles/renewals-forms/new_combined';
import { active_health_covers } from 'src/assets/styles/renewals-forms/active_Health_covers';
import { payment } from 'src/assets/styles/renewals-forms/payment';

@Component({
  selector: 'app-paymentstatus',
  templateUrl: './paymentstatus.component.html',
  styleUrls: ['./paymentstatus.component.scss']
})
export class PaymentstatusComponent {
  orderId: string | undefined;
  paymentStatus: string | undefined
  constructor(private route: ActivatedRoute,
    private renewalService: RenewalsService,
    private router: Router,
    private encryptionService: EncryptionService,
    private toast: NgToastService, private spinner: LoadingService) { }

  ngOnInit() {
    const pathArray = this.route.snapshot.url;
    console.log(pathArray);
    if (pathArray && pathArray.length > 0) {
      console.log(pathArray.length);
      this.orderId = pathArray[pathArray.length - 1].path;
    }
    console.log(this.orderId);
    this.testPaymentStatus();
  }
  getPaymentStatus() {
    this.renewalService.getPaymentStatusApi(this.orderId, {}).subscribe(
      (res: any) => {
        console.log("payment response", res);
        if (res.isSuccess) {
          this.paymentStatus = res.data.paymentStatus
          if (this.paymentStatus == "SUCCESS") {
            console.log("payment status", this.paymentStatus);
            // this.renewalService.setPaymentStatus('1');
            // this.router.navigate([`renewal/payment`]);
            this.toast.success({ detail: "success", summary: "policy renewed uccessfully", duration: 1500 });

          }
          else if (this.paymentStatus == "INTIATED") {
            console.log("payment status", this.paymentStatus);
            // this.renewalService.setPaymentStatus('2');
            // this.router.navigate([`renewal/payment`]);
            this.toast.error({ detail: "Error", summary: "Your payment is in processing", duration: 1500 });
          }
          else {
            console.log("payment status", this.paymentStatus);
            // this.renewalService.setPaymentStatus('2');
            // this.router.navigate([`renewal/payment`]);
            this.toast.error({ detail: "Error", summary: "Your payment is Failed try again once", duration: 1500 });
          }
        }
        else {
          console.log("Failed");
        }
      },
      (err: any) => {
        sessionStorage.setItem("paymentStatus", "2");
        console.log("Error is coming from getPaymentStatus Api");
      }
    )
  }

  testPaymentStatus() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();

      const paymentDetails = {
        "proposalNumber": "240000705788",
        "productName": "Activ Health Platinum Enhanced",
        "policyStartDate": "10/31/2023",
        "receiptID": "TEST12345",
        "policyNumber": "TEST987654321",
        "policyEndDate": "10/30/2024",
        "status": "UnderWriter",
        "paymentStatus": "INPROGRESS"
      }
      if (paymentDetails.paymentStatus == 'SUCCESS') {
        this.router.navigate(['renewal/renewalJourney'], {
          queryParams: {
            formData: this.encryptionService.encrypt(paymentDetails),
            proposalNum: this.encryptionService.encrypt(paymentDetails.proposalNumber),
            policyNumber: this.encryptionService.encrypt(paymentDetails.policyNumber),
            journeyProcess:this.encryptionService.encrypt(0),
            formSequence: this.encryptionService.encrypt([new_combinedForms,active_health_covers,payment,thankYou]),
            formIndex: this.encryptionService.encrypt("3")
          }
        });
      }
      else if(paymentDetails.paymentStatus == 'FAILED'){
        this.router.navigate(['renewal/renewalJourney'], {
          queryParams: {
            formData: this.encryptionService.encrypt(paymentDetails),
            proposalNum: this.encryptionService.encrypt(paymentDetails.proposalNumber),
            policyNumber: this.encryptionService.encrypt(paymentDetails.policyNumber),
            journeyProcess:this.encryptionService.encrypt(0),
            formSequence: this.encryptionService.encrypt([new_combinedForms,active_health_covers,payment,thankYou]),
            formIndex: this.encryptionService.encrypt("2")
          }
        });
      }
      else if(paymentDetails.paymentStatus == 'INPROGRESS'){
        this.router.navigate(['renewal/renewalList']);
      }
    }, 3000); // 2000 milliseconds = 2 seconds
  }

}
