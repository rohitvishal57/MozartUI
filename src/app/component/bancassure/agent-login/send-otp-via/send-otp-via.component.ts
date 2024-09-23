import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/services/login.service';


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
    this.filteredContacts = this.data.data;
  }

  // onSearch() {
  //   const query = this.searchQuery.toLowerCase(); 
  //   this.filteredContacts = this.data.data.filter((contact:any) => {
  //     return contact.toLowerCase().includes(query);
  //   });  
  // }

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
    "eventName": "",
    "requestId": "",
    "otpNumber": "",
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
          next: (res)=>{
            console.log(res);
            localStorage.setItem("requestId", res?.requestId);
          },
          error: (err => {
            console.log(err);
            this.toast.error({ detail: "ERROR", summary:err, sticky: true });
          })
        })

    this.dialogRef.close({data:data,status:'Success'})
  }
  close(){
    this.dialogRef.close();
  }
}
