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
      if (params['token']) {
        localStorage.setItem('token', params['token']); 
      }
      this.orderId = params['orderId'] ? params['orderId'] : "" ;
      if(this.orderId){
        this.getOrderDetails();
      }else{
        this.businessType = params['bT'] ? params['bT'] : ""
      }
      this.route.url.subscribe((segments: UrlSegment[]) => {
        if (segments.length > 0 && segments[0].path === 'sharePayment') {
          this.userType = "Customer";
      
          if (this.businessType === 'REN') {
            const formData = {
              policyNumber: this.route.snapshot.queryParams['pNo'],
            };
            localStorage.setItem('agentCode', '5100003');
            this.router.navigate(['renewal/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
                formIndex: "0",
              }
            });return;
          } else if (this.businessType === 'NB') {
            const formData = {
              proposalNumber: this.route.snapshot.queryParams['pNo'],
            };
            localStorage.setItem('agentCode', '5100003');
            this.router.navigate(['yatra/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
                formIndex: "0",
              }
            });
            return;
          }
        } else {
          this.userType = "Agent";
        }
      });
      }
    
        
    console.log(this.orderId);
    // this.user='Customer';
    // this.userModule='renewal';
    // this.getPaymentStatus();
   // this.getOrderDetails();
  }

  async getOrderDetails(){
    const orderDetailsReq = {
      orderId: this.orderId,
      businessType: this.businessType || ""
    }
    console.log(orderDetailsReq,"orderId");
   
    await this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
      async (res: any) => {
        console.log(res);
        if(res.data.businessType == 'Renewal'){
          this.businessType='REN'
          this.userType=res.data.userType          
        }else if(res.data.businessType == 'NB'){
          this.businessType='NB'
          this.userType=res.data.userType
        }
        this.paymentDetail=res.data;
        if(this.paymentDetail.paymentMethodType == "enach_payment"){
          const orderDetailsReq = {
            orderId: this.paymentDetail.mandateOrderId,
            businessType:this.businessType
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
          if(this.paymentDetail.paymentStatus == 'SUCCESS' && this.paymentDetail.isFullQuoteSuccess == true){
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
      else if(this.businessType == 'REN'){
        if(this.paymentDetail?.paymentMethodType == 'emandate_payment'){
          const reqData = {
            agentcode: this.paymentDetail.agentCode,
            proposalNumber: '',
            paymentMethod: 'enach_payment',
            source: 'Retail',
            policyType: 'Renewal',
            policyNumber: this.paymentDetail?.oldPolicyNumber || '',
            quoteNumber: "",
            productName: this.paymentDetail.productName,
            userType:'Agent',
            mandateOrderId:this.paymentDetail.orderId
          };
          this.renewalService.justPayRedirection(reqData).subscribe(
            (response:any)=>{
              if(response?.isSuccess){
                window.location.href = response.data.paymentURL;
              }
            },(error)=>{
              console.log('error',error);
            });
        }else if (this.paymentDetail?.paymentStatus === 'SUCCESS' || this.paymentDetail?.paymentStatus === 'INITIATED') {
          const formData = {
            proposalNumber: this.paymentDetail.proposalId || '',
            policyNumber: this.paymentDetail.oldPolicyNumber || '',
            policyStatus: this.paymentDetail.policyStatus || '',
            policyStartDate: this.paymentDetail.policyStartDate || '',
            policyEndDate: this.paymentDetail.policyEndDate || '',
            receiptID: this.paymentDetail.receiptNumber || '',
            customerId: this.paymentDetail.customerId || '',
            applicationNumber: this.paymentDetail.applicationNumber || '',
            status: this.paymentDetail.policyStatus || '',
            productName: this.paymentDetail.productName || '',
            premiumPaid: this.paymentDetail.premiumPaid || '',
            isFullQuoteSuccess: this.paymentDetail.isFullQuoteSuccess || false 
          };
          // const formData = this.paymentDetail;         
          if (this.paymentDetail?.isFullQuoteSuccess) {
            this.toast.success({ detail: "SUCCESS", summary: "Payment successful", duration: 5000 });   
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                proposalNum: this.encryptionService.encrypt(""),
                policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([payment, thankYou]),
                formIndex: "1",
              },
            });   
          } else {
            this.toast.warning({ detail: "Warning", summary: "Payment was successful, but policy issuance failed.", duration: 5000 });
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                proposalNum: this.encryptionService.encrypt(""),
                policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([payment, thankYou]),
                formIndex: "0",
              },
            });
          }
        
          // Navigate to the next route with the encrypted data
          
        }
         else if(this.paymentDetail?.paymentStatus == 'INPROGRESS'|| this.paymentDetail?.paymentStatus == 'PENDING'){
        this.toast.success({detail: "SUCCESS",summary: "payment Pending",duration: 5000});
        this.router.navigate(['renewal/renewalList'], {
          state: {
            policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
            paymentStatus: this.encryptionService.encrypt(this.paymentDetail?.paymentStatus),
          }
        });
      } else{
        this.toast.error({ detail: "", summary: "Payment failed", duration: 5000 });   
        const formData = this.paymentDetail;         
        this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                proposalNum: this.encryptionService.encrypt(""),
                policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([payment, thankYou]),
                formIndex: "0",
              }
            });
       }

      }

    }
    else if(this.paymentDetail.userType == 'Customer'){
      if(this.businessType == 'NB'){
      const formData = {
        proposalNumber: this.paymentDetail.proposalId,
        policyNumber: this.paymentDetail.policyNumber,
        policyStatus: this.paymentDetail.policyStatus,
        policyStartDate: this.paymentDetail.policyStartDate,
        policyEndDate: this.paymentDetail.policyEndDate,
        receiptID: this.paymentDetail.receiptNumber,
        customerId: this.paymentDetail.customerId,
        applicationNumber: this.paymentDetail.applicationNumber,
        status: this.paymentDetail.paymentStatus
      };
      localStorage.setItem('agentCode', '5100003');
      localStorage.setItem('formIndex', '1');
      this.router.navigate(['yatra/customerPayment'], {
        state: {
          formData: this.encryptionService.encrypt(formData),
          formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
          formIndex: "1",
        }
      });
    }else if(this.businessType == 'REN' || this.paymentDetail.businessType == 'Renewal'){
      if(this.paymentDetail?.paymentMethodType == 'emandate_payment'){
        const reqData = {
            agentcode: this.paymentDetail.agentCode,
            proposalNumber: '',
            paymentMethod: 'enach_payment',
            source: 'Retail',
            policyType: 'Renewal',
            policyNumber: this.paymentDetail?.oldPolicyNumber || '',
            quoteNumber: "",
            productName: this.paymentDetail.productName,
            userType:'Customer',
            mandateOrderId:this.paymentDetail.orderId
        };
        this.renewalService.justPayRedirection(reqData).subscribe(
          (response:any)=>{
            if(response?.isSuccess){
              window.location.href = response.data.paymentURL;
            }
          },(error)=>{
            console.log('error',error);
          });
      }else if (this.paymentDetail?.paymentStatus == 'SUCCESS' || this.paymentDetail?.paymentStatus == 'INTIATED') {
        const formData = {
          proposalNumber: this.paymentDetail.proposalId || '',
          policyNumber: this.paymentDetail.oldPolicyNumber || '',
          policyStatus: this.paymentDetail.policyStatus || '',
          policyStartDate: this.paymentDetail.policyStartDate || '',
          policyEndDate: this.paymentDetail.policyEndDate || '',
          receiptID: this.paymentDetail.receiptNumber || '',
          customerId: this.paymentDetail.customerId || '',
          applicationNumber: this.paymentDetail.applicationNumber || '',
          status: this.paymentDetail.policyStatus || '',
          productName: this.paymentDetail.productName || '',
          premiumPaid: this.paymentDetail.premiumPaid || '',
          isFullQuoteSuccess: this.paymentDetail.isFullQuoteSuccess || false 
        };
        
        // const formData = this.paymentDetail;         
        if (this.paymentDetail?.isFullQuoteSuccess) {
          this.toast.success({ detail: "SUCCESS", summary: "Payment successful", duration: 5000 });   
          this.router.navigate(['renewal/customerPayment'], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              proposalNum: this.encryptionService.encrypt(""),
              policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
              journeyProcess: this.encryptionService.encrypt(0),
              formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
              formIndex: "1",
            },
          });   
        } else {
          this.toast.warning({ detail: "Warning", summary: "Payment was successful, but policy issuance failed.", duration: 5000 });
          this.router.navigate(['renewal/customerPayment'], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              proposalNum: this.encryptionService.encrypt(""),
              policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
              journeyProcess: this.encryptionService.encrypt(0),
              formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
              formIndex: "0",
            },
          });
        }
    } else if(this.paymentDetail.paymentStatus == 'INPROGRESS'|| this.paymentDetail?.paymentStatus == 'PENDING'){
      this.toast.success({detail: "SUCCESS",summary: "payment Pending",duration: 5000});
      const formData = {
        proposalNumber: this.paymentDetail.proposalId || '',
        policyNumber: this.paymentDetail.oldPolicyNumber || '',
        policyStatus: this.paymentDetail.policyStatus || '',
        policyStartDate: this.paymentDetail.policyStartDate || '',
        policyEndDate: this.paymentDetail.policyEndDate || '',
        receiptID: this.paymentDetail.receiptNumber || '',
        customerId: this.paymentDetail.customerId || '',
        applicationNumber: this.paymentDetail.applicationNumber || '',
        status: this.paymentDetail.policyStatus || '',
        productName: this.paymentDetail.productName || '',
        premiumPaid: this.paymentDetail.premiumPaid || '',
        isFullQuoteSuccess: this.paymentDetail.isFullQuoteSuccess || false 
      };
      this.router.navigate(['renewal/customerPayment'], {
        state: {
          formData: this.encryptionService.encrypt(formData),
          proposalNum: this.encryptionService.encrypt(""),
          policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
          journeyProcess: this.encryptionService.encrypt(0),
          formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
          formIndex: "0",
        }
      });
    } 
    }
    }
  }

}
