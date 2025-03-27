import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { YatraService } from 'src/app/yatra/yatra/yatra.service';

@Component({
  selector: 'app-payment-check',
  templateUrl: './payment-check.component.html',
  styleUrls: ['./payment-check.component.scss']
})
export class PaymentCheckComponent implements OnInit{
  displayMessage: any;
  leadId: any;
  policyDetails:any;
  justPayPayload:any;
  paymentStatus:any = "";
  productCode: any;
  agentCode: string | null = "";
  isD2C!: boolean;
  isTS!: boolean;
  isBB!: boolean;
  rugService: any;
  constructor(private yatraService: YatraService, private toast: NgToastService) { }
  ngOnInit() {
    this.displayMessage = "Payment is pending";
    console.log(this.displayMessage);
    if (history.state.leadId)
      this.leadId = history.state.leadId;
    if (history.state.message)
      this.displayMessage = history.state.message;

    this.agentCode = localStorage.getItem('agentCode');
    if(history.state.policyDetails){
      this.policyDetails = history.state.policyDetails
      this.productCode = this.policyDetails.proposerDetails.proposerDetails.productCode

      if(this.policyDetails?.paymentInformation.paymentStatus == "FAILED"){
        this.paymentStatus == this.policyDetails?.paymentInformation.paymentStatus
      }

      if (this.agentCode != "467898" && this.agentCode != "467896") {
            this.isD2C = false;
            this.isTS = false;
            this.isBB = true;
          } else if (this.agentCode == "467898" && (this.productCode == "D01" || this.productCode == "D02" || this.productCode == "D03" || this.productCode == "D04")) {
            this.isD2C = true;
            this.isBB = false;
            this.isTS = false
            this.rugService.changeStatus(true)
          } else if (this.agentCode == "467896") {
            this.isD2C = false;
            this.isBB = false;
            this.isTS = true;
          }else{
            this.isD2C = false;
            this.isBB = false;
            this.isTS = false;
          }

    }


      console.log(this.justPayPayload);
  }

  generateJustPayPayload(){
    if(this.isD2C){
      
      this.justPayPayload =  { 
        "agentcode": localStorage.getItem('agentCode'),
         "proposalNumber": this.leadId,
         "paymentMethod": this.policyDetails.paymentInformation.txRefNo, // paymentMethod parameter is not available in response getting value in txRefNo.
         "source": "RUG",
         "policyType": "New Business",
         "policyNumber": "", 
         "quoteNumber": "",
         "OrderId": "",
         "Amount": Math.round(this.policyDetails.paymentInformation.amount),
         "FirstName": this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[0],
         "MiddleName": this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.length > 2  ? this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ') ?.[1]: "",
         "LastName":this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.length > 2 ? this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[2]  : this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[1] || '.',
         "Phone": this.policyDetails.proposerDetails.proposerDetails.mobileNumber,
         "Email": this.policyDetails.proposerDetails.proposerDetails.emailAddress,
         "DOB": this.policyDetails.proposerDetails.proposerDetails.dob,                   
         "appName":"D2C"
                
        }


    }else if(this.isBB){
      this.justPayPayload =  { 
        "agentcode": localStorage.getItem('agentCode'),
         "proposalNumber": this.leadId,
         "paymentMethod": this.policyDetails.paymentInformation.txRefNo, // paymentMethod parameter is not available in response getting value in txRefNo.
         "source": "RUG",
         "policyType": "New Business",
         "policyNumber": "", 
         "quoteNumber": "",
         "OrderId": "",
         "Amount": Math.round(this.policyDetails.paymentInformation.amount),
         "FirstName": this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[0],
         "MiddleName": this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.length > 2  ? this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ') ?.[1]: "",
         "LastName":this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.length > 2 ? this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[2]  : this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[1] || '.',
         "Phone": this.policyDetails.proposerDetails.proposerDetails.mobileNumber,
         "Email": this.policyDetails.proposerDetails.proposerDetails.emailAddress,
         "DOB": this.policyDetails.proposerDetails.proposerDetails.dob, 
         "appName": "BRANCHBANKING",
                
        }
    }else if(this.isTS){
      this.justPayPayload =  { 
        "agentcode": localStorage.getItem('agentCode'),
         "proposalNumber": this.leadId,
         "paymentMethod": this.policyDetails.paymentInformation.txRefNo, // paymentMethod parameter is not available in response getting value in txRefNo.
         "source": "RUG",
         "policyType": "New Business",
         "policyNumber": "", 
         "quoteNumber": "",
         "OrderId": "",
         "Amount": Math.round(this.policyDetails.paymentInformation.amount),
         "FirstName": this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[0],
         "MiddleName": this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.length > 2  ? this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ') ?.[1]: "",
         "LastName":this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.length > 2 ? this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[2]  : this.policyDetails.proposerDetails.proposerDetails.customerName.split(' ')?.[1] || '.',
         "Phone": this.policyDetails.proposerDetails.proposerDetails.mobileNumber,
         "Email": this.policyDetails.proposerDetails.proposerDetails.emailAddress,
         "DOB": this.policyDetails.proposerDetails.proposerDetails.dob,                   
        "appName": "TELESALES"
                
        }
    }


  }

  callJustpay(){
    this.generateJustPayPayload();
    this.d2cJustPayRedirection(this.justPayPayload)
  }
  d2cJustPayRedirection(req:any){
    let payload =     {    "agentcode": "4620973",    "proposalNumber": "UPP102810271861",    "paymentMethod": "autoDebit",    "source": "RUG",    "policyType": "New Business",    "policyNumber": "",    "quoteNumber": "",    "OrderId": "",    "Amount": 500000,    "FirstName": "Demojs",    "MiddleName": "",    "LastName": "Person",    "Phone": "9992232551",    "Email": "LHME.SHAH@ARVIND.IN",    "DOB": "10/07/1997"}
    this.yatraService.d2cJustpayRedirection(req).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.isSuccess == true && res.statusCode == 200) {
          this.toast.success({ detail: "Success", summary: res.message, duration: 3000 });
          window.location.href = res.data.paymentURL
          // if (this.getFormIndexValue() < this.formSequence.length - 1) {
          //   this.incrementIndex();
          //   this.getFormDataFromFormSequence(this.formSequence[this.getFormIndexValue()].formId);
            
          // }

        }else{
          this.toast.warning({ detail: "Warning", summary: res.message, duration: 3000 });
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
