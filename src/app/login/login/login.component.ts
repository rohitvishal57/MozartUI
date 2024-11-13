import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Subject, interval } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

import {take} from 'rxjs/operators';
import { SendOtpViaComponent } from '../send-otp-via/send-otp-via.component';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  codeForm!: FormGroup;
  verifyOtpEnable:boolean = false;
  private readonly _destroying$ = new Subject<void>();
  backgroundImageUrl: string | undefined;
  otp: string[] = ['', '', '', '', '', ''];  // Initialize OTP array
  maskedUserCode:any = ''
  loginWithUsername:boolean = true;
  errorMessage: string = '';
  timeLeft: number = 30; 
  isTimerRunning: boolean = false; 
  contactInfoData: string[] = [];
  timerOn: boolean = true;
  userErrorMsg: string = "";
  captchaErrorMsg: string = "";

  captchaCode: string | any;
  enteredCaptchaCode: string | any = '';
  isSubmitted: boolean = false;
  
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,
    private toast: NgToastService,public common:CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog){
      this.loginForm = this.fb.group({
        userName: ['', [Validators.required]],
        captcha: ['', [Validators.required]]
      })
      this.codeForm = this.fb.group({
        verify: ['', [Validators.required]],
      })
  
      this.captchaCode = this.generateCaptcha();
  }

  ngOnInit(){
    this.backgroundImageUrl = "assets/logo/Backgroundimage_ABHI.jpg"; 
    localStorage.clear();
    sessionStorage.clear();
  }

  generateCaptcha(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  }

  openModal(contactInfoData: string[]) {
    const dialogRef = this.dialog.open(SendOtpViaComponent, {
      data: {userCode: this.codeForm.value.verify, data: this.contactInfoData},
    });
         
    dialogRef.afterClosed().subscribe(result => {
      if(result.status == 'Success'){
        this.verifyOtpEnable = true;
        this.maskUserCode(result.data);
        this.startTimer();
      } else if(result.status == 'Failure') {
        this.verifyOtpEnable = false;
        this.errorMessage = result.data;
      }
    });
  }

  sendOtpReqBody: any = {
    "agentCode": "",
    "eventName": "",
    "requestId": "",
    "otpNumber": "",
    "mobileNumber": "",
    "eMailId": ""
  }

  isMobile(str: any){
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern.test(str);
  };
  
  resendOTP(){
    const data = localStorage.getItem('sendOTP');
    this.sendOtpReqBody.agentCode = localStorage.getItem("agentCode");
    this.isMobile(data) ? this.sendOtpReqBody.mobileNumber =  data : this.sendOtpReqBody.eMailId = data;
    this.errorMessage = "";
    this.otp = ['', '', '', '', '', ''];

    this.loginService.sendOtpRequestApi(this.sendOtpReqBody)
        .subscribe({  
          next: (res:any)=>{
            if(res.data && res.isSuccess && res.statusCode == '200' && res.data.requestId !== null) {
              localStorage.setItem("requestId", res?.data.requestId);
              this.toast.success({ detail: "SUCCESS", summary: "Sent OTP again to "+this.maskedUserCode, duration: 5000 });
              this.startTimer();
            } else {
              this.errorMessage = res.message;
            }
          },
          error: (err => {
            console.log(err);
            this.errorMessage = err;
            // this.toast.error({ detail: "ERROR", summary:err, duration: 5000 });
          })
        })
  }

  startTimer() {
    this.timeLeft = 30;
    this.isTimerRunning = false;
    if (this.isTimerRunning) return; // Prevent multiple timers from starting
    this.isTimerRunning = true;

    // RxJS interval emits every second (1000ms)
    const timer$ = interval(1000).pipe(
      take(this.timeLeft) // Complete the observable after 'timeLeft' seconds
    );

    // Subscribe to the interval
    timer$.subscribe({
      next: () => {
        this.timeLeft--; // Decrease the time left by 1 every second
      },
      complete: () => {
        this.isTimerRunning = false; // Reset once the timer completes
      }
    });
  }

  resetPasswordPayload = {
    "userName": ""
  }


  handleReset() {
    if(this.loginForm.valid) {
      this.resetPasswordPayload.userName = this.loginForm.value.userName;
      this.loginService.resetPasswordRequestApi(this.resetPasswordPayload)
      .subscribe({  
        next: (res:any)=>{
            window.open(res.data.redirectUrl, "_blank");
        },
        error: ((err:any) => {
          console.log(err);
          this.toast.error({ detail: "ERROR", summary:err, duration: 5000 });
        })
      })
    } else {
        Object.keys(this.loginForm.controls).forEach(field => {
          const control = this.loginForm.get(field);
          if (control instanceof FormGroup) {
            control?.markAsDirty({ onlySelf: true });
          }
          else {
            control?.markAsTouched({ onlySelf: true });
          }
        });
      }
    
  }

  refreshCaptcha(){
    this.enteredCaptchaCode = '';
    this.captchaCode = this.generateCaptcha();
  }

  resetFormAndCaptcha(){
    // this.loginForm.reset();
    this.enteredCaptchaCode = '';
    this.captchaCode = this.generateCaptcha();
  }

  onKeyDownEvent() {
    this.captchaErrorMsg = "";
    this.isSubmitted = false;
  }

  contactDetailsReqBody: any = {
    "userId": ""
  }

  onSubmit(data:any){
    if(this.loginForm.valid){
      this.userErrorMsg = "";
      this.isSubmitted = true;
      if(this.enteredCaptchaCode == this.captchaCode){
        if(data == 'SSO'){
          this.loginService.sendAgentLoginRequestApi(this.loginForm.value)
            .subscribe({  
              next: (res:any)=>{
                if(res.data && res.isSuccess && res.statusCode == '200') {
                  this.resetFormAndCaptcha();
                  localStorage.setItem('agentCode', this.loginForm.value.userName);
                  window.open(res.data.redirectUrl, "_blank");
                } else {
                  this.userErrorMsg = res.message;
                }
              },
              error: ((err:any) => {
                console.log(err);
                this.toast.error({ detail: "ERROR", summary:err, duration: 5000 });
                this.resetFormAndCaptcha();
              })
            })
        } else{
          this.contactDetailsReqBody.userId = this.loginForm.value.userName;
          this.loginService.getContactDetailsByAgentCodeApi(this.contactDetailsReqBody)
            .subscribe({  
              next: (res:any)=>{
                if(res?.data?.contactInfo?.length > 0){
                  this.contactInfoData = res?.data?.contactInfo?.map((obj: any) => obj.communicationValue);
                  localStorage.setItem("agentCode", this.loginForm.value.userName);
                  console.log(this.contactInfoData);
                  this.openModal(this.contactInfoData);
                  this.loginWithUsername = false;
                }else{
                  this.userErrorMsg = res.message;
                }
              
              },
              error: (err => {
                this.toast.error({ detail: "ERROR", summary:err, duration: 5000 });
                this.resetFormAndCaptcha();
              })
            })
        }
      } else {
            // this.toast.error({ detail: "ERROR", summary:'Please enter valid CAPTCHA', duration: 5000 });
            this.captchaErrorMsg = 'Please enter valid CAPTCHA';
            this.resetFormAndCaptcha();
        }
    }
    else {
      console.log('Form is invalid', this.loginForm);
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        if (control instanceof FormGroup) {
          control?.markAsDirty({ onlySelf: true });
        }
        else {
          control?.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

   // Handle key events for OTP input
   onKey(event: KeyboardEvent, index: number) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;

    // Move to the next box when a number is entered
    if (event.key >= '0' && event.key <= '9') {
      this.otp[index] = event.key;  // Store digit
      if (index < 5) {
        const nextInput = document.getElementsByTagName('input')[index+1] as HTMLInputElement;
        nextInput.focus();
      }
    }

    // Handle backspace
    else if (event.key === 'Backspace') {
      this.otp[index] = '';  // Clear current box
      if (index > 0) {
        const previousInput = document.getElementsByTagName('input')[index-1] as HTMLInputElement;
        previousInput.focus();
      }
    }
  }

  validateOtpReqBody: any = {
    "agentCode": "",
    "eventName": "",
    "requestId": "",
    "otpNumber": "",
    "mobileNumber": "",
    "eMailId": ""
  }
 
  onVerifyOTP(){
    const otpCode = this.otp.join('');
    this.errorMessage = "";
    if (otpCode.length === 6 && /^[0-9]+$/.test(otpCode)) {

      this.validateOtpReqBody.agentCode = localStorage.getItem("agentCode");
      this.validateOtpReqBody.requestId = localStorage.getItem("requestId");
      this.validateOtpReqBody.otpNumber = otpCode;
      this.otp = ['', '', '', '', '', ''];

      this.loginService.validateOtpRequestApi(this.validateOtpReqBody)
        .subscribe({  
          next: (res:any)=> {
            if(res.data && res.statusCode == '200' && res.isSuccess && res.token !== null) {
              localStorage.setItem('userData', JSON.stringify(res.data));
              this.router.navigate(['dashboard']);
            } else {
              this.errorMessage = res.message;
              res.message.includes("Your Account Has been locked") ? this.timerOn = false : this.timerOn = true;
            }
          },
          error: (err => {
            console.log(err);
            this.errorMessage = err;
          })
        })
    } else {
      this.errorMessage = "Please enter valid OTP";
    }
  }

  maskUserCode(input: string): string {
    if (!input) return '';
    this.maskedUserCode = '';
    const isEmail = input.includes('@');
    if (isEmail) {
      const [localPart, domain] = input.split('@');
      const visibleLocalPart = localPart.slice(0, 2);
      const maskedLocalPart = '*'.repeat(localPart.length - 2);
      this.maskedUserCode = `${visibleLocalPart}${maskedLocalPart}@${domain}`;;
      return this.maskedUserCode;
    } else {
      const visibleStart = input.slice(0, 2);
      const visibleEnd = input.slice(-2);
      const maskedMiddle = '*'.repeat(input.length - 4);
      this.maskedUserCode = `${visibleStart}${maskedMiddle}${visibleEnd}`;
      return this.maskedUserCode;
    }
  }

}