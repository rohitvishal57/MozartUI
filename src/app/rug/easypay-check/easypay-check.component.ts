import { Component } from '@angular/core';
import { RugService } from '../rug.service';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-easypay-check',
  templateUrl: './easypay-check.component.html',
  styleUrls: ['./easypay-check.component.scss']
})
export class EasypayCheckComponent {
  requestData :any;
  requestPayloadData:any;
  responseData: any
  capturePaymentRequest: any;
  captureResponse: any;
constructor( private rugService: RugService, private http: HttpClient, private toast: NgToastService,private configService: ConfigService){

}

  enquirePayment(){
    console.log(this.requestData);
    if(this.requestData == undefined){
      return;
    }
    this.requestPayloadData = JSON.parse(this.requestData);
    let reqObj = {
      Identifier: this.requestPayloadData.Identifier,
      RequestUUID: this.requestPayloadData.RequestUUID,
      LeadId: this.requestPayloadData.LeadId,
      RequestDatetime: this.requestPayloadData.RequestDatetime,
      CorporateCode: this.requestPayloadData.CorporateCode,
    }
    this.rugService.getEnquirePaymentDetails(reqObj).subscribe({
      next: (res: any) => {
        console.log(res)
        this.capturePaymentRequest =  res;
        this.responseData = JSON.stringify(res);
        console.log(this.responseData);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  capturePayment(){
    let reqObj = this.capturePaymentRequest
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`;
    
    console.log(formattedDate);
    let obj = {
      identifier: this.capturePaymentRequest.identifier,
      requestUUID: this.capturePaymentRequest.requestUUID,
      leadId: this.capturePaymentRequest.leadId,
      paymentType: "FP",
      requestDateTime: formattedDate,
      transactionNo: "658758577",
      transatonAmount: this.capturePaymentRequest.transactionAmount,
      chequeDate: this.capturePaymentRequest.chequeDate,
      status: "1",
      corporateCode: this.capturePaymentRequest.corporateCode,
      paymentFlag: "000",
      micrNumber: this.capturePaymentRequest.micrNumber,
      instrumentNo: this.capturePaymentRequest.instrumentNo,
      bankName: this.capturePaymentRequest.bankName,
      branchName: this.capturePaymentRequest.branchName,
      ifscCode: this.capturePaymentRequest.ifscCode,
      chequeType: "",
      accountNumber: this.capturePaymentRequest.accountNumber,
      easyPayId: "658758577",
      productName: this.capturePaymentRequest.productName,
      additionalEasyPayId: "",
      additionalField1: "",
      additionalField2: "",
      additionalField3: "",
      additionalField4: ""
    }
    this.rugService.getCapturePaymentDetails(obj).subscribe({
      next: (res: any) => {
        console.log(res)
        this.captureResponse = JSON.stringify(res);
        console.log(this.captureResponse)
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
