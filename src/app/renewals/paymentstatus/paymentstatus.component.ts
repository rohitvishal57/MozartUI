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
    // const pathArray = this.route.snapshot.url;
    // console.log(pathArray);
    // if (pathArray && pathArray.length > 0) {
    //   console.log(pathArray.length);
    //   this.orderId = pathArray[pathArray.length - 1].path;
    // }

    // if (Object.keys(this.route.snapshot.queryParams).length) {
    //   this.route.queryParams.subscribe(async params => {
    //     this.orderId = params['orderid']
    //     if(params['token']){
    //       localStorage.setItem('token',params['token']);
    //     }
    //   })
    // }

    if (Object.keys(this.route.snapshot.queryParams).length) {
      const params = this.route.snapshot.queryParams;
      this.orderId = params['orderid'];
      if (params['token']) {
        localStorage.setItem('token', 'aa59deee594c4c90abd5737929d0302e');
      }
    }
    
    console.log(this.orderId);
    this.getPaymentStatus();
  }
  // getPaymentStatus() {
  //   this.renewalService.getPaymentStatusApi(this.orderId, {}).subscribe(
  //     (res: any) => {
  //       console.log("payment response", res);
  //       if (res.isSuccess) {
  //         this.paymentStatus = res.data.paymentStatus
  //         if (this.paymentStatus == "SUCCESS") {
  //           console.log("payment status", this.paymentStatus);
  //           // this.renewalService.setPaymentStatus('1');
  //           // this.router.navigate([`renewal/payment`]);
  //           this.toast.success({ detail: "success", summary: "policy renewed uccessfully", duration: 1500 });

  //         }
  //         else if (this.paymentStatus == "INTIATED") {
  //           console.log("payment status", this.paymentStatus);
  //           // this.renewalService.setPaymentStatus('2');
  //           // this.router.navigate([`renewal/payment`]);
  //           this.toast.error({ detail: "Error", summary: "Your payment is in processing", duration: 1500 });
  //         }
  //         else {
  //           console.log("payment status", this.paymentStatus);
  //           // this.renewalService.setPaymentStatus('2');
  //           // this.router.navigate([`renewal/payment`]);
  //           this.toast.error({ detail: "Error", summary: "Your payment is Failed try again once", duration: 1500 });
  //         }
  //       }
  //       else {
  //         console.log("Failed");
  //       }
  //     },
  //     (err: any) => {
  //       sessionStorage.setItem("paymentStatus", "2");
  //       console.log("Error is coming from getPaymentStatus Api");
  //     }
  //   )
  // }

  getPaymentStatus() {
    // this.spinner.show();

    // setTimeout(() => {
    //   this.spinner.hide();

    //   const paymentDetails = {
    //     "proposalNumber": "240000705788",
    //     "productName": "Activ Health Platinum Enhanced",
    //     "policyStartDate": "10/31/2023",
    //     "receiptID": "TEST12345",
    //     "policyNumber": "TEST987654321",
    //     "policyEndDate": "10/30/2024",
    //     "status": "UnderWriter",
    //     "paymentStatus": "SUCCESSS"
    //   }
    //   if (paymentDetails.paymentStatus == 'SUCCESS') {
    //     console.log('inside success');
        
    //     this.router.navigate(['renewal/renewalJourney'], {
    //       queryParams: {
    //         formData: this.encryptionService.encrypt(paymentDetails),
    //         proposalNum: this.encryptionService.encrypt(paymentDetails.proposalNumber),
    //         policyNumber: this.encryptionService.encrypt(paymentDetails.policyNumber),
    //         journeyProcess:this.encryptionService.encrypt(0),
    //         formSequence: this.encryptionService.encrypt([new_combinedForms,active_health_covers,payment,thankYou]),
    //         formIndex: this.encryptionService.encrypt("3")
    //       }
    //     });
    //   }
    //   else if(paymentDetails.paymentStatus == 'FAILED'){
    //     console.log('inside failed');
        
    //     this.router.navigate(['renewal/renewalJourney'], {
    //       queryParams: {
    //         formData: this.encryptionService.encrypt(paymentDetails),
    //         proposalNum: this.encryptionService.encrypt(paymentDetails.proposalNumber),
    //         policyNumber: this.encryptionService.encrypt(paymentDetails.policyNumber),
    //         journeyProcess:this.encryptionService.encrypt(0),
    //         formSequence: this.encryptionService.encrypt([new_combinedForms,active_health_covers,payment,thankYou]),
    //         formIndex: this.encryptionService.encrypt("2")
    //       }
    //     });
    //   }
    //   else if(paymentDetails.paymentStatus == 'INPROGRESS'){
    //     console.log('InProgress');
        
    //     this.router.navigate(['renewal/renewalList']);
    //   }
    // }, 3000); // 2000 milliseconds = 2 seconds


    const orderDetailsReq = {
      "orderId": this.orderId
    }
    this.renewalService.getFullQuoteApi(orderDetailsReq).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          const orderData = res.data;
          // this.formData.policyStatus = res.data.status || null;
          // this.formData.quoteValidFromDate = res.data.policyStartDate || null;
          // this.formData.quoteValidToDate = res.data.policyEndDate || null;
          // this.formData.ReceiptNumber = res.data.receiptID || null;
          // this.formData.customerId = res.data.customerId || null;
          // this.incrementIndex();
          // this.getFormDataFromFormSequence();

          // this.fullQuoteResponse=res.data;          
          // this.setSection('thankyou')
          // this.hideSection=false
          // this.isFeedBackModalVisible = true;




          if (orderData.paymentStatus == 'SUCCESS') {
                console.log('inside success');
                
                this.router.navigate(['renewal/renewalJourney'], {
                  queryParams: {
                    formData: this.encryptionService.encrypt(orderData.orderDetails),
                    proposalNum: this.encryptionService.encrypt(orderData.orderDetails.proposalNumber),
                    policyNumber: this.encryptionService.encrypt(orderData.orderDetails.policyNumber),
                    journeyProcess:this.encryptionService.encrypt(0),
                    formSequence: this.encryptionService.encrypt([new_combinedForms,active_health_covers,payment,thankYou]),
                    formIndex: this.encryptionService.encrypt("3")
                  }
                });
              }
              else if(orderData.paymentStatus == 'FAILED'){
                console.log('inside failed');
                
                this.router.navigate(['renewal/renewalJourney'], {
                  queryParams: {
                    formData: this.encryptionService.encrypt(orderData.orderDetails),
                    proposalNum: this.encryptionService.encrypt(orderData.orderDetails.proposalNumber),
                    policyNumber: this.encryptionService.encrypt(orderData.orderDetails.policyNumber),
                    journeyProcess:this.encryptionService.encrypt(0),
                    formSequence: this.encryptionService.encrypt([new_combinedForms,active_health_covers,payment,thankYou]),
                    formIndex: this.encryptionService.encrypt("2")
                  }
                });
              }
              else if(orderData.paymentStatus == 'INPROGRESS'){
                console.log('InProgress');
                
                this.router.navigate(['renewal/renewalList']);
              }
          console.log(res.data);

        }
        else {
          this.toast.error({ detail: '', summary: res.message || "Failed to do Payment", duration: 3000 });
        }
      },
      (err) => {
        this.toast.error({ detail: '', summary: 'Failed to do online payment.', duration: 3000 });
        console.log("error is coming from fullquote api");
      })

  }

}
