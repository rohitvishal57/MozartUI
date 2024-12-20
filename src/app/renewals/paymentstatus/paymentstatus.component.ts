import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalsService } from '../renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { LoadingService } from 'src/app/services/loading.service';
import { thankYou } from 'src/assets/styles/renewals-forms/combined_forms';
import { payment } from 'src/assets/styles/renewals-forms/payment';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';

@Component({
  selector: 'app-paymentstatus',
  templateUrl: './paymentstatus.component.html',
  styleUrls: ['./paymentstatus.component.scss']
})
export class PaymentstatusComponent {
  orderId: string | undefined;
  paymentStatus: string | undefined;
  userType:string | undefined;
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
      // if(params['userType']){
      //   this.userType= params['userType']
      // }
    }
    this.getPaymentStatus();
  }

  getPaymentStatus() {
    const orderDetailsReq = {
      orderId: this.orderId,
      businessType : "REN"
    }
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
                ProductName: res.data.productName,
                userType:this.userType
              };
              this.yatraService.justPayRedirection(reqData).subscribe(
                (response:any)=>{
                  if(response?.isSuccess){
                    window.location.href = response.data.paymentURL;
                  }
                },(error)=>{
                  console.log('error',error);
                });
            }else if (res.data.paymentStatus == 'SUCCESS' || res.data.paymentStatus == 'INTIATED') {
                this.toast.success({detail: "SUCCESS",summary: "payment completed Successfully",duration: 5000});
                // const formData = {
                //   productName: res.data.productName,
                //   ...res.data.orderDetails,
                // };   
                const formData=res.data;         
                this.router.navigate(['renewal/renewalJourney'], {
                  state: {
                    formData: this.encryptionService.encrypt(formData),
                    proposalNum: this.encryptionService.encrypt(""),
                    policyNumber: this.encryptionService.encrypt(orderData.policyNumber),
                    journeyProcess: this.encryptionService.encrypt(0),
                    formSequence: this.encryptionService.encrypt([payment, thankYou]),
                    paymentStatus: this.encryptionService.encrypt(res.data.paymentStatus),
                    formIndex: "1",
                  }
                });
          } else if(res.data.paymentStatus == 'INPROGRESS'|| res.data.paymentStatus == 'PENDING'){
            this.toast.success({detail: "SUCCESS",summary: "payment Pending",duration: 5000});
            this.router.navigate(['renewal/renewalList'], {
              state: {
                paymentStatus: this.encryptionService.encrypt(res.data.paymentStatus),
              }
            });
          } else{
            const renewalInfoRequestBody = {
              policy_Number: res.data.policyNumber
            };
            this.renewalService.getRenewalInfoApi(renewalInfoRequestBody).subscribe(
              (res: any) => {
                const formData = res.data;                
                  this.router.navigate(['renewal/renewalJourney'], {
                  state: {
                    formData: this.encryptionService.encrypt(formData),
                    proposalNum: this.encryptionService.encrypt(""),
                    policyNumber: this.encryptionService.encrypt(orderData.policyNumber),
                    journeyProcess: this.encryptionService.encrypt(0),
                    formSequence: this.encryptionService.encrypt([payment, thankYou]),
                    formIndex: "0",
                  }
                });
              },
              (err) => {
                console.error("Error from getRenewalInfo API:", err);
                this.toast.error({ detail: "", summary: "Error while getting renewal Information.", duration: 3000 });
              }
            );   
          } 
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