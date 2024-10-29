import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from '../login/login.service';


@Component({
  selector: 'app-send-otp-via',
  templateUrl: './send-otp-via.component.html',
  styleUrls: ['./send-otp-via.component.scss']
})
export class SendOtpViaComponent implements OnInit{
  // searchQuery: string = '';
  filteredContacts: any[] = []; 
  constructor( public dialogRef: MatDialogRef<SendOtpViaComponent>, private loginService: LoginService, private toast: NgToastService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any){

  }

  ngOnInit(): void {   
    this.filteredContacts = this.fitlerCommunicationValue(this.data.data);
  }

  fitlerCommunicationValue(arr: any) {
    return arr.filter((str : any) => str !== '' && str !== null);
  }

  maskUserCode(input: string): string {
    if (!input) return '';
    const isEmail = input.includes('@');
    if (isEmail) {
      const [localPart, domain] = input.split('@');
      const visibleLocalPart = localPart.slice(0, 2);
      const maskedLocalPart = '*'.repeat(localPart.length - 2);
  
      return `${visibleLocalPart}${maskedLocalPart}@${domain}`;
    } else {
      const visibleStart = input.slice(0, 2);
      const visibleEnd = input.slice(-2);
      const maskedMiddle = '*'.repeat(input.length - 4);
  
      return `${visibleStart}${maskedMiddle}${visibleEnd}`;
    }
  }

  sendOtpReqBody: any = {
    "agentCode": "",
    "mobileNumber": "",
    "eMailId": ""
  }

  isMobile(str: string){
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern.test(str);
  };

  onSelect(data:any){
    localStorage.setItem("sendOTP", data);
    this.sendOtpReqBody.agentCode = localStorage.getItem("agentCode");
    this.isMobile(data) ? this.sendOtpReqBody.mobileNumber =  data : this.sendOtpReqBody.eMailId = data;

    this.loginService.sendOtpRequestApi(this.sendOtpReqBody)
        .subscribe({  
          next: (res:any) => {
            if(res.data && res.isSuccess && res.statusCode == '200') {
              localStorage.setItem("requestId", res?.data?.requestId);
              if(res?.data.requestId == null) {
                this.dialogRef.close({data: res.data.errorMessage, status:'Failure'});
              }
            }
          },
          error: (err => {
            console.log(err);
            this.toast.error({ detail: "ERROR", summary:err, duration:5000 });
          })
        })

    this.dialogRef.close({data:data, status:'Success'})
  }
  close(){
    this.dialogRef.close();
  }
}
