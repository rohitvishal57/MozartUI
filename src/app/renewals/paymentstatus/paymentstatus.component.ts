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
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { error } from 'jquery';

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
    private toast: NgToastService, private spinner: LoadingService,
    private yatraService: YatraService) {
      console.log('Component constructor initialized');
     }

  ngOnInit() {
    
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

  getPaymentStatus() {
    const orderDetailsReq = {
      "orderId": this.orderId
    }
    console.log(orderDetailsReq);
    

    this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
      (res: any) => {
        if (res.isSuccess) {
          const orderData = res.data.orderDetails;
            if(res?.data?.paymentMethod == 'emandate_payment'){

              const reqData = {
                agentcode: localStorage.getItem('agentCode'),
                proposalNumber: '',
                paymentMethod: 'enach_payment',
                source: 'Retail',
                policyType: 'Renewal',
                policyNumber: orderData?.policyNumber,
                quoteNumber: '',
                OrderID: ''
              };


              this.yatraService.justPayRedirection(reqData).subscribe(
                (response:any)=>{
                  if(response?.isSuccess){
                    window.location.href = response.data.paymentURL;
                  }
                },(error)=>{
                  console.log('error',error);
                });
                
            }

          if (orderData.paymentStatus == 'SUCCESS' || orderData.paymentStatus == 'INTIATED') {
            console.log('inside success');
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(orderData.orderDetails),
                proposalNum: this.encryptionService.encrypt(orderData.orderDetails.proposalNumber),
                policyNumber: this.encryptionService.encrypt(orderData.orderDetails.policyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([payment, thankYou]),
                formIndex: "1",
              }
            });
          } else if(orderData.paymentStatus == 'INPROGRESS'){
            console.log('InProgress');
            this.router.navigate(['renewal/renewalList']);
          } else{
            console.log('inside failed');
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(orderData.orderDetails),
                proposalNum: this.encryptionService.encrypt(orderData.orderDetails.proposalNumber),
                policyNumber: this.encryptionService.encrypt(orderData.orderDetails.policyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([payment, thankYou]),
                formIndex: "0",
              }
            });

            // const renewalInfoRequestBody = {
            //   policy_Number: orderData.orderDetails.policyNumber,
            // };

            // this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
            //   (res: any) => {
            //     if (res.data && Object.keys(res.data).length > 0) {
            //       // Prepare data for state
            //       const formData = this.encryptionService.encrypt(res.data);
            //       const policyNumber = this.encryptionService.encrypt(orderData.orderDetails.policyNumber);
            //       const journeyProcess = this.encryptionService.encrypt(0);
        
            //       // Navigate with state
            //       this.router.navigate(['renewal/renewalJourney'], {
            //         state: {
            //           formData: formData,
            //           policyNumber: policyNumber,
            //           journeyProcess: journeyProcess,
            //           formIndex: "2", // Include formIndex in state
            //         },
            //       });
            //     } else {
            //       this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
            //     }
            //   },
            //   (err) => {
            //     console.error("Error from getRenewalInfo API:", err);
            //     this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
            //   }
            // );



            // this.router.navigate(['renewal/renewalJourney'], {
            //   state: {
            //     formData: this.encryptionService.encrypt(orderData.orderDetails),
            //     proposalNum: this.encryptionService.encrypt(orderData.orderDetails.proposalNumber),
            //     policyNumber: this.encryptionService.encrypt(orderData.orderDetails.policyNumber),
            //     journeyProcess: this.encryptionService.encrypt(0),
            //     formSequence: this.encryptionService.encrypt([new_combinedForms, active_health_covers, payment, thankYou]),
            //     formIndex: "2",
            //   }
            // }); if (orderData.paymentStatus == 'INPROGRESS')
          }
    
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