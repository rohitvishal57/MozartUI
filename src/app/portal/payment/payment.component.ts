import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { RenewalsService } from 'src/app/renewals/renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { LoadingService } from 'src/app/services/loading.service';
import { thankYou } from 'src/assets/styles/renewals-forms/combined_forms';
import { payment } from 'src/assets/styles/renewals-forms/payment';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { customer_payment } from 'src/assets/styles/renewals-forms/customer_payment';
import { error } from 'jquery';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  orderId: string | undefined;
  paymentStatus: string | undefined;
  user:string | undefined;
  userModule:string|undefined;
  paymentDetail: any;
  businessType: any;
  userType!: string;

  constructor(private route: ActivatedRoute,
    private renewalService: RenewalsService,
    private router: Router,
    private encryptionService: EncryptionService,
    private toast: NgToastService, private spinner: LoadingService,
    private yatraService: YatraService) {
     }

  ngOnInit() {
    if (Object.keys(this.route.snapshot.queryParams).length) {
      const params = this.route.snapshot.queryParams;
      this.orderId = params['orderId'] ? params['orderId'] : "" ;
      this.businessType = params['bT'] ? params['bT'] : ""
      if (params['token']) {
        localStorage.setItem('token', params['token']); 
      }
    }
    console.log(this.orderId);
    // this.user='Customer';
    // this.userModule='renewal';
    // this.getPaymentStatus();
    this.getOrderDetails();
  }

  async getOrderDetails(){
    const orderDetailsReq = {
      orderId: this.orderId,
      businessType:"NB"
    }
    console.log(orderDetailsReq);
   
    await this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
      async (res: any) => {
        console.log(res);
        this.paymentDetail=res.data;
        if(this.paymentDetail.paymentMethodType == "enach_payment"){
          const orderDetailsReq = {
            orderId: this.paymentDetail.mandateOrderId,
            businessType:"NB"
          }
          console.log(orderDetailsReq);
         
          await this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
            (res: any) => {
              this.paymentDetail=res.data;
              this.paymentDetail.paymentMethodType ='enach_payment';
              this.redirectingFunction();
            },
            (err:any)=>{
              console.error(err);
            });
          }else{
            this.redirectingFunction()
          }
        
      },
      (err) => {
        this.toast.error({ detail: '', summary: 'Failed to do online payment.', duration: 3000 });
      }
    );
  }
  redirectingFunction(){
    if(this.paymentDetail.userType == 'Agent'){
      if(this.paymentDetail.businessType == 'NB'){
        if(this.paymentDetail.paymentMethodType == 'emandate_payment'){
          const reqData = {
            agentcode: this.paymentDetail.agentCode,
            proposalNumber: this.paymentDetail.proposalId,
            paymentMethod: 'enach_payment',
            source: 'Retail',
            policyType: 'NB',
            policyNumber: '',
            quoteNumber: "",
            productName: this.paymentDetail.productName,
            userType:'Agent',
            mandateOrderId:this.paymentDetail.orderId
          };
          console.log(reqData);
          this.yatraService.justPayRedirection(reqData).subscribe({
            next: (response: any) => {
              console.log('Juspay API Response:', response);
    
              if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
                // if (this.selectedButton == 'sendLinkButton') {
                //   console.log(response);
                //   this.dynamicFormGroup.get(control.dependentControls[0])?.setValue(response.data.paymentURL);
                //   // res = response.data.paymentURL;
                // }
                // else {
                //   window.location.href = response.data.paymentURL; // Redirect to Juspay Payment URL
                // }
                window.location.href = response.data.paymentURL; // Redirect to Juspay Payment URL
              } else {
                this.toast.warning({ detail: "WARNING", summary: "Invalid payment link received", duration: 3000 });
                console.error('Invalid payment link received:', response);
              }
            },
            error: (error) => {
              this.toast.error({ detail: "ERROR", summary: "Failed to generate payment link", duration: 3000 });
              console.error('Error generating payment link:', error);
            }
          });
        }
        else{
          const reqData = {
            partnerId: this.paymentDetail.partnerId,
            productId: this.paymentDetail.productId,
            formId: "6",
            proposalNum: this.paymentDetail.proposalId,
            agentCode: "5100003",
            currentFormSequence: "",
            leadId: this.paymentDetail.leadId,
            policyNumber : this.paymentDetail.policyNumber,
            policyStatus : this.paymentDetail.policyStatus,
            policyStartDate : this.paymentDetail.policyStartDate,
            policyEndDate : this.paymentDetail.policyEndDate,
            ReceiptNumber : this.paymentDetail.receiptNumber,
            customerId : this.paymentDetail.customerId,
            applicationNumber : this.paymentDetail.applicationNumber,
            paymentStatus : this.paymentDetail.paymentStatus
          }
          if(this.paymentDetail.paymentStatus == 'SUCCESS'){
            localStorage.setItem("formIndex", "8");
          }
          else{
            localStorage.setItem("formIndex", "7");

          }
          const encodedEncryptedData = this.encryptionService.encrypt(reqData);
    
          this.router.navigate(['yatra'], {
            queryParams: { data: encodedEncryptedData }
          });
        }
      }
      else if(this.paymentDetail.businessType == 'RENEWAL'){

      }
    }
    else if(this.paymentDetail.userType == 'Customer'){
      this.router.navigate(['yatra/customerPayment'], {
        state: {
          // formData: this.encryptionService.encrypt(),
          formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
          // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
          // formIndex: "1",
        }
      });
    }
  }
  getPaymentStatus() {
    if(this.user == 'Customer'){
      if(this.userModule == 'renewal'){
        this.router.navigate(['renewal/customerPayment'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            // formIndex: "1",
          }
        });
      }else if(this.userModule == 'yatra'){
        this.router.navigate(['yatra/customerPayment'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            // formIndex: "1",
          }
        });

      }else{

      }
    }else if(this.user == 'Agent'){
      if(this.userModule == 'renewal'){
        this.router.navigate(['renewal/paymentstatus'], {
          queryParams: {
            orderid: 'UP_241216_c3698374',
            token: 'aa59deee594c4c90abd5737929d0302e'
          }
        });        
      }else if(this.userModule == 'yatra'){
        this.router.navigate(['yatra'], {
          state: {
            // formData: this.encryptionService.encrypt(),
            // formSequence: this.encryptionService.encrypt([]),
            // kycStatus: this.encryptionService.encrypt(kycData.kycStatus),
            // formIndex: "1",
          }
        });

      }else{

      }
    }else{

    }
  }

}
