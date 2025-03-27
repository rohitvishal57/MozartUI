import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { RenewalsService } from 'src/app/renewals/renewals.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { LoadingService } from 'src/app/services/loading.service';
import { thankYou, thankYouFQFailed, thankYouPending } from 'src/assets/styles/renewals-forms/combined_forms';
import { leads, payment } from 'src/assets/styles/renewals-forms/payment';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';
import { customer_payment, detailsForms } from 'src/assets/styles/renewals-forms/customer_payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  orderId: string | undefined;
  paymentStatus: string | undefined;
  user: string | undefined;
  userModule: string | undefined;
  paymentDetail: any;
  businessType: any;
  userType!: string;
  agentCode:any;

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
      if(params['agentcode']){
        this.agentCode = params['agentcode'];
        localStorage.setItem('agentCode', this.agentCode);
      }
      this.orderId = params['orderId'] ? params['orderId'] : "";
      if (this.orderId) {
        this.getOrderDetails();
      } else {
        this.businessType = params['bT'] ? params['bT'] : ""
      }
      this.route.url.subscribe((segments: UrlSegment[]) => {
        if (segments.length > 0 && segments[0].path === 'sharePayment') {
          this.userType = "Customer";
          if (this.businessType === 'REN') {
            const formData = {
              policyNumber: this.route.snapshot.queryParams['pNo'],
            };
            this.router.navigate(['renewal/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
                formIndex: "0",
              }
            }); return;
          } else if (this.businessType === 'NB') {
            const formData = {
              proposalNumber: this.route.snapshot.queryParams['pNo'],
            };
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
  }

  async getOrderDetails() {
    const orderDetailsReq = {
      orderId: this.orderId,
      businessType: this.businessType || ""
    }
    await this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
      async (res: any) => {
        console.log(res);
        localStorage.setItem('agentCode', res.data.agentCode);
        if (res.data.businessType == 'Renewal') {
          this.businessType = 'REN'
          this.userType = res.data.userType
        } else if (res.data.businessType == 'NB') {
          this.businessType = 'NB'
          this.userType = res.data.userType
        }
        this.paymentDetail = res.data;
        if (this.paymentDetail.paymentMethodType == "enach_payment") {
          const orderDetailsReq = {
            orderId: this.paymentDetail.mandateOrderId,
            businessType: this.businessType
          }
          await this.renewalService.getPaymentDetails(orderDetailsReq).subscribe(
            (res: any) => {
              console.log(res);
              this.paymentDetail = res.data;
              this.paymentDetail.paymentMethodType = 'enach_payment';
              this.redirectingFunction();
            },
            (err: any) => {
              console.error(err);
            });
        } else {
          this.redirectingFunction();
        }
      },
      (err) => {
        this.toast.error({ detail: 'Error', summary: 'Failed to do online payment.', duration: 3000 });
      }
    );
  }
  redirectingFunction() {
    if (this.paymentDetail.userType == 'Agent') {
      if (this.paymentDetail.businessType == 'NB') {
        if (this.paymentDetail.paymentMethodType == 'emandate_payment') {
          if (this.paymentDetail.paymentStatus == 'SUCCESS' || this.paymentDetail.paymentStatus == 'PENDING'){
            const reqData = {
              agentcode: this.paymentDetail.agentCode,
              proposalNumber: this.paymentDetail.proposalId,
              paymentMethod: 'enach_payment',
              source: 'Retail',
              policyType: 'NB',
              policyNumber: '',
              quoteNumber: "",
              productName: this.paymentDetail.productName,
              userType: 'Agent',
              mandateOrderId: this.paymentDetail.orderId
            };
            console.log(reqData);
            this.yatraService.justPayRedirection(reqData).subscribe({
              next: (response: any) => {
                console.log('Juspay API Response:', response);
  
                if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
                  window.location.href = response.data.paymentURL; // Redirect to Juspay Payment URL
                } else {
                  this.toast.error({ detail: "Error", summary: "Invalid payment link received", duration: 3000 });
                  console.error('Invalid payment link received:', response);
                }
              },
              error: (error) => {
                this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
                console.error('Error generating payment link:', error);
              }
            });
          }
          else {
            const reqData:any = {
              partnerId: this.paymentDetail.partnerId,
              productId: this.paymentDetail.productId,
              formId: "5",
              proposalNum: this.paymentDetail.proposalId,
              agentCode: this.paymentDetail.agentCode,
              currentFormSequence: "7",
              leadId: this.paymentDetail.leadId,
              policyNumber: this.paymentDetail.policyNumber,
              policyStatus: this.paymentDetail.policyStatus,
              policyStartDate: this.paymentDetail.policyStartDate,
              policyEndDate: this.paymentDetail.policyEndDate,
              ReceiptNumber: this.paymentDetail.receiptNumber,
              customerId: this.paymentDetail.customerId,
              applicationNumber: this.paymentDetail.applicationNumber,
              paymentStatus: this.paymentDetail.paymentStatus,
            }
            sessionStorage.setItem("formIndex", "7");
            this.toast.error({ detail: "Error", summary: 'payment '+this.paymentDetail.paymentStatus || " Failed", duration: 5000 });
            const encodedEncryptedData = this.encryptionService.encrypt(reqData);

            this.router.navigate(['yatra'], {
              queryParams: { data: encodedEncryptedData }
            });
          }
        }
        else {
          let reqData:any;
          if (this.paymentDetail.paymentStatus == 'SUCCESS' || this.paymentDetail.paymentStatus == 'PENDING') {
            reqData = {
              partnerId: this.paymentDetail.partnerId,
              productId: this.paymentDetail.productId,
              formId: "6",
              proposalNum: this.paymentDetail.proposalId,
              agentCode: this.paymentDetail.agentCode,
              currentFormSequence: "8",
              leadId: this.paymentDetail.leadId,
              policyNumber: this.paymentDetail.policyNumber,
              policyStatus: this.paymentDetail.policyStatus,
              policyStartDate: this.paymentDetail.policyStartDate,
              policyEndDate: this.paymentDetail.policyEndDate,
              ReceiptNumber: this.paymentDetail.receiptNumber,
              customerId: this.paymentDetail.customerId,
              applicationNumber: this.paymentDetail.applicationNumber,
              paymentStatus: this.paymentDetail.paymentStatus,
            }
            // if(this.paymentDetail?.isFullQuoteSuccess){
              this.toast.success({ detail: "Success", summary: 'payment '+this.paymentDetail.paymentStatus, duration: 5000 });
              sessionStorage.setItem("formIndex", "8");
            // }
            // else{
            //   this.toast.warning({ detail: "Warning", summary: "Payment was successful, but policy issuance failed.", duration: 5000 });
            //   localStorage.setItem("formIndex", "7");
            // }
          }
          else {
            reqData = {
              partnerId: this.paymentDetail.partnerId,
              productId: this.paymentDetail.productId,
              formId: "5",
              proposalNum: this.paymentDetail.proposalId,
              agentCode: this.paymentDetail.agentCode,
              currentFormSequence: "7",
              leadId: this.paymentDetail.leadId,
              policyNumber: this.paymentDetail.policyNumber,
              policyStatus: this.paymentDetail.policyStatus,
              policyStartDate: this.paymentDetail.policyStartDate,
              policyEndDate: this.paymentDetail.policyEndDate,
              ReceiptNumber: this.paymentDetail.receiptNumber,
              customerId: this.paymentDetail.customerId,
              applicationNumber: this.paymentDetail.applicationNumber,
              paymentStatus: this.paymentDetail.paymentStatus,
            }
            sessionStorage.setItem("formIndex", "7");
            this.toast.error({ detail: "Error", summary: 'payment '+this.paymentDetail.paymentStatus || " Failed", duration: 5000 });
          }
          const encodedEncryptedData = this.encryptionService.encrypt(reqData);

          this.router.navigate(['yatra'], {
            queryParams: { data: encodedEncryptedData }
          });
        }
      }
      else if (this.businessType == 'REN') {
        const formData = {
          proposalNumber: this.paymentDetail.proposalId || '',
          policyNumber: this.paymentDetail.policyNumber || this.paymentDetail.oldPolicyNumber || '',
          policyStatus: this.paymentDetail.policyStatus || '',
          policyStartDate: this.paymentDetail.policyStartDate || '',
          policyEndDate: this.paymentDetail.policyEndDate || '',
          receiptID: this.paymentDetail.receiptNumber || '',
          customerId: this.paymentDetail.customerId || '',
          applicationNumber: this.paymentDetail?.applicationNumber || this.paymentDetail.proposalId || '',
          status: this.paymentDetail.policyStatus || '',
          productName: this.paymentDetail.productName || '',
          premiumPaid: this.paymentDetail.premiumPaid || '',
          isFullQuoteSuccess: this.paymentDetail.isFullQuoteSuccess || false,
          paymentMessage :"",
          policyNo: this.paymentDetail?.policyNumber,
          paymentStatus :this.paymentDetail?.paymentStatus,
          paymentMethodType:this.paymentDetail?.paymentMethodType
        };
        if (this.paymentDetail?.paymentMethodType == 'emandate_payment') {
          if (this.paymentDetail.paymentStatus == 'SUCCESS' || this.paymentDetail.paymentStatus == 'PENDING'){

          const reqData = {
            agentcode: this.paymentDetail.agentCode,
            proposalNumber: '',
            paymentMethod: 'enach_payment',
            source: 'Retail',
            policyType: 'Renewal',
            policyNumber: this.paymentDetail?.oldPolicyNumber || '',
            quoteNumber: "",
            productName: this.paymentDetail.productName,
            userType: 'Agent',
            mandateOrderId: this.paymentDetail.orderId
          };
          this.renewalService.justPayRedirection(reqData).subscribe(
            (response: any) => {
              if (response?.isSuccess) {
                window.location.href = response.data.paymentURL;
              }
              else {
                this.toast.warning({ detail: "Warning", summary: response.message || "Invalid payment link received", duration: 3000 });
                console.error('Invalid payment link received:', response);
              }
            }, (error) => {
              this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
              console.log('error', error);
            });
          }
          else {
            this.toast.error({ detail: "Error", summary: this.paymentDetail.policyRejectedReason || "Payment failed", duration: 3000 });
            this.router.navigate(['renewal/renewalJourney'], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              proposalNum: this.encryptionService.encrypt(""),
              fromList: this.encryptionService.encrypt("payment"),
              formSequence: this.encryptionService.encrypt([detailsForms,leads,payment,thankYou]),
              formIndex: "2",
            }
          });
          }  
        } else if (this.paymentDetail?.paymentStatus === 'SUCCESS' || this.paymentDetail?.paymentStatus?.startsWith('IN')) {
          if (this.paymentDetail?.isFullQuoteSuccess) {
            this.toast.success({ detail: "Success", summary: this.paymentDetail.policyRejectedReason || "Payment successful", duration: 5000 });
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                proposalNum: this.encryptionService.encrypt(""),
                // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                fromList: this.encryptionService.encrypt("payment"),
                formSequence: this.encryptionService.encrypt([detailsForms,leads,payment,thankYou]),
                formIndex: "3",
              },
            });
          } else {
            this.toast.warning({ detail: "Warning", summary: this.paymentDetail.policyRejectedReason || "Payment was successful, but policy issuance failed.", duration: 5000 });
            formData.paymentMessage = "Payment completed successfully; policy issuance pending";
            this.router.navigate(['renewal/renewalJourney'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                fromList: this.encryptionService.encrypt("payment"),
                // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                formIndex: "3",
              },
            });
          }
        }
        else if (this.paymentDetail?.paymentStatus == 'INPROGRESS' || this.paymentDetail?.paymentStatus == 'PENDING') {
          formData.paymentMessage = "Payment pending; please wait for processing";
          this.toast.warning({ detail: "Warning", summary: this.paymentDetail.policyRejectedReason || "payment Pending", duration: 5000 });
          this.router.navigate(['renewal/renewalJourney'], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
              paymentStatus: this.encryptionService.encrypt(this.paymentDetail?.paymentStatus),
              formIndex: "3",
            }
          });
        } else {
          this.toast.error({ detail: "Error", summary: this.paymentDetail.policyRejectedReason || "Payment failed", duration: 5000 });
          this.router.navigate(['renewal/renewalJourney'], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              proposalNum: this.encryptionService.encrypt(""),
              // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
              formSequence: this.encryptionService.encrypt([detailsForms,leads,payment,thankYou]),
              formIndex: "2",
            }
          });
        }
      }
    }
    else if (this.paymentDetail.userType == 'Customer') {
      if (this.businessType == 'NB') {
        const formData = {
          proposalNumber: this.paymentDetail.proposalId,
          policyNumber: this.paymentDetail.policyNumber,
          policyStatus: this.paymentDetail.policyStatus,
          policyStartDate: this.paymentDetail.policyStartDate,
          policyEndDate: this.paymentDetail.policyEndDate,
          receiptID: this.paymentDetail.receiptNumber,
          customerId: this.paymentDetail.customerId,
          applicationNumber: this.paymentDetail.applicationNumber,
          status: this.paymentDetail.policyStatus,
          isFullQuoteSuccess: this.paymentDetail.isFullQuoteSuccess || false,
          paymentMessage:"",
          paymentStatus: this.paymentDetail.paymentStatus
        };
        // localStorage.setItem('agentCode', this.agentCode);
        if (this.paymentDetail?.paymentMethodType == 'emandate_payment') {
          const reqData = {
            agentcode: this.paymentDetail.agentCode,
            proposalNumber: this.paymentDetail.proposalId,
            paymentMethod: 'enach_payment',
            source: 'Retail',
            policyType: 'NB',
            policyNumber: '',
            quoteNumber: "",
            productName: this.paymentDetail.productName,
            userType: 'Customer',
            mandateOrderId: this.paymentDetail.orderId
          };
          this.renewalService.justPayRedirection(reqData).subscribe(
            (response: any) => {
              if (response.data.paymentURL && response.data.paymentURL !== null && response.data.paymentURL !== '') {
                window.location.href = response.data.paymentURL; // Redirect to Juspay Payment URL
              } else {
                this.toast.error({ detail: "Error", summary: "Invalid payment link received", duration: 3000 });
                console.error('Invalid payment link received:', response);
              }
            }, (error) => {
              this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
              console.error('Error generating payment link:', error);
            });
        } else if (this.paymentDetail?.paymentStatus == 'SUCCESS' || this.paymentDetail?.paymentStatus == 'INTIATED') {
          if (this.paymentDetail?.isFullQuoteSuccess) {
            this.toast.success({ detail: "SUCCESS", summary: "Payment successful", duration: 5000 });
            // localStorage.setItem('formIndex', '1');
            this.router.navigate(['yatra/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
                formIndex: "1",
              }
            });
          }
          else{
            this.toast.warning({ detail: "Warning", summary: "Payment was successful, but policy issuance failed.", duration: 5000 });
            // localStorage.setItem('formIndex', '1');
            formData.paymentMessage = "Payment completed successfully; policy issuance pending";
            this.router.navigate(['yatra/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([thankYou]),
                formIndex: "0",
              }
            });
          }
          
        } else if (this.paymentDetail.paymentStatus == 'INPROGRESS' || this.paymentDetail?.paymentStatus == 'PENDING') {
            this.toast.success({ detail: "SUCCESS", summary: "payment "+ this.paymentDetail.paymentStatus, duration: 5000 });
            formData.paymentMessage = "Payment pending; please wait for processing";
            this.router.navigate(['yatra/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([thankYou]),
                formIndex: "0",
              }
            });
        } else {
            this.toast.error({ detail: "Error", summary: "Payment failed", duration: 5000 });
            this.router.navigate(['yatra/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
                formIndex: "0",
              }
            });
        }
      } else if (this.businessType == 'REN' || this.paymentDetail.businessType == 'Renewal') {
        const formData = {
          proposalNumber: this.paymentDetail.proposalId || '',
          policyNumber: this.paymentDetail.policyNumber || this.paymentDetail.oldPolicyNumber || '',
          policyStatus: this.paymentDetail.policyStatus || '',
          policyStartDate: this.paymentDetail.policyStartDate || '',
          policyEndDate: this.paymentDetail.policyEndDate || '',
          receiptID: this.paymentDetail.receiptNumber || '',
          customerId: this.paymentDetail.customerId || '',
          applicationNumber: this.paymentDetail?.applicationNumber || this.paymentDetail.proposalId || '',
          status: this.paymentDetail.policyStatus || '',
          productName: this.paymentDetail.productName || '',
          premiumPaid: this.paymentDetail.premiumPaid || '',
          isFullQuoteSuccess: this.paymentDetail.isFullQuoteSuccess || false,
          paymentMessage :"",
          policyNo: this.paymentDetail?.policyNumber,
          paymentStatus :this.paymentDetail?.paymentStatus
        };
        if (this.paymentDetail?.paymentMethodType == 'emandate_payment') {
          if (this.paymentDetail.paymentStatus == 'SUCCESS' || this.paymentDetail.paymentStatus == 'PENDING'){
          const reqData = {
            agentcode: this.paymentDetail.agentCode,
            proposalNumber: '',
            paymentMethod: 'enach_payment',
            source: 'Retail',
            policyType: 'Renewal',
            policyNumber: this.paymentDetail?.oldPolicyNumber || '',
            quoteNumber: "",
            productName: this.paymentDetail.productName,
            userType: 'Customer',
            mandateOrderId: this.paymentDetail.orderId
          };
          this.renewalService.justPayRedirection(reqData).subscribe(
            (response: any) => {
              if (response?.isSuccess) {
                window.location.href = response.data.paymentURL;
              } else {
                this.toast.warning({ detail: "Warning", summary: response.message || "Invalid payment link received", duration: 3000 });
                console.error('Invalid payment link received:', response);
              }
            }, (error) => {
              this.toast.error({ detail: "Error", summary: "Failed to generate payment link", duration: 3000 });
              console.log('error', error);
            });
          } else {
            this.toast.error({ detail: "Error", summary: this.paymentDetail.policyRejectedReason || "Payment failed", duration: 5000 });
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
        } else if (this.paymentDetail?.paymentStatus == 'SUCCESS' || this.paymentDetail?.paymentStatus == 'INTIATED') {
          if (this.paymentDetail?.isFullQuoteSuccess) {
            this.toast.success({ detail: "Success", summary: this.paymentDetail.policyRejectedReason || "Payment successful", duration: 5000 });
            this.router.navigate(['renewal/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                proposalNum: this.encryptionService.encrypt(""),
                // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                journeyProcess: this.encryptionService.encrypt(0),
                formSequence: this.encryptionService.encrypt([customer_payment, thankYou]),
                formIndex: "1",
              },
            });
          } else {
            this.toast.warning({ detail: "Warning", summary: this.paymentDetail.policyRejectedReason || "Payment was successful, but policy issuance pending.", duration: 5000 });
            formData.paymentMessage = "Payment completed successfully; policy issuance pending";
            this.router.navigate(['renewal/customerPayment'], {
              state: {
                formData: this.encryptionService.encrypt(formData),
                // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
                formSequence: this.encryptionService.encrypt([thankYou]),
                formIndex: "0",
              },
            });
          }
        } else if (this.paymentDetail.paymentStatus == 'INPROGRESS' || this.paymentDetail?.paymentStatus == 'PENDING') {
           this.toast.warning({ detail: "Warning", summary: this.paymentDetail.policyRejectedReason || `${'payment '+ this.paymentDetail.paymentStatus}` , duration: 5000 });
           formData.paymentMessage = "Payment pending; please wait for processing";
           this.router.navigate(['renewal/customerPayment'], {
            state: {
              formData: this.encryptionService.encrypt(formData),
              // policyNumber: this.encryptionService.encrypt(this.paymentDetail.oldPolicyNumber),
              formSequence: this.encryptionService.encrypt([thankYou]),
              formIndex: "0",
            }
          });
         } else {
           this.toast.error({ detail: "Error", summary: this.paymentDetail.policyRejectedReason || "Payment failed", duration: 5000 });
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
