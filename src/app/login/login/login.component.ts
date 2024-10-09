import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Subject, filter, interval, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import { SendOtpViaComponent } from '../send-otp-via/send-otp-via.component';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  @ViewChild('googleButton') googleButton!: ElementRef;

  loginForm!: FormGroup;
  codeForm!: FormGroup;
  verifyOtpEnable:boolean = false;
  //for Microsoft Login
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  passwordFieldType: string='password';
  backgroundImageUrl: string | undefined;
  otp: string[] = ['', '', '', '', '', ''];  // Initialize OTP array
  activeBtn:string = "Login with User Code";
  maskedUserCode:any = ''
  loginWithUsername:boolean = true;
  loginWithUserOTP:boolean = true;
  searchMobileOrEmail:boolean = false;
  myControl = new FormControl('');
  options: string[] = ['8639646720', '8331891659', '7995608665'];
  filteredOptions: Observable<string[]> | any;
  errorMessage: string = '';

  timeLeft: number = 60; 
  isTimerRunning: boolean = false; 
  AgentcContactDetails: any = [];
  contactInfoData: string[] = [];
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,
    private toast: NgToastService,public common:CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog){
  }

  ngOnInit(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.backgroundImageUrl = "assets/logo/Backgroundimage_ABHI.jpg"; 
    localStorage.clear()
    sessionStorage.clear()
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
    })
    this.codeForm = this.fb.group({
      verify: ['', [Validators.required]],
    })
    this.isIframe = window !== window.parent && !window.opener;
  }

  selectFormType(data:any){
    this.activeBtn = data;
    if(data == 'Login with User Code'){
      this.loginWithUserOTP = false;
      this.loginWithUsername = true;
       this.codeForm = this.fb.group({
        verify: ['', [Validators.required]],
      })
      this.verifyOtpEnable = false;
      this.otp = ['', '', '', '', '', ''];
      this.searchMobileOrEmail = false;
      this.myControl.reset();
    }else{
      this.loginWithUserOTP = true;
      this.loginWithUsername = false;
      this.loginForm = this.fb.group({
        userName: ['', [Validators.required]],
      })
    }
  }

  contactDetailsReqBody: any = {
    "userId": ""
  }
  
  onVerifySubmit(){
    if(this.codeForm.valid){
      console.log(this.codeForm.value.verify);
      this.contactDetailsReqBody.userId = this.codeForm.value.verify;
      localStorage.setItem("agentCode", this.codeForm.value.verify);
      this.loginService.getContactDetailsByAgentCodeApi(this.contactDetailsReqBody)
        .subscribe({  
          next: (res:any)=>{
            console.log(res.contactInfo);
            this.contactInfoData = res?.contactInfo?.map((obj: any) => obj.communicationValue);
            this.openModal(this.contactInfoData);
          },
          error: (err => {
            console.log(err);
            this.toast.error({ detail: "ERROR", summary:err, sticky: true });
          })
        })
    }else{
      this.verifyOtpEnable = false;
      this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
    }
  }

  openModal(contactInfoData: string[]) {
    const dialogRef = this.dialog.open(SendOtpViaComponent, {
      data: {userCode: this.codeForm.value.verify, data: this.contactInfoData},
    });
         
    dialogRef.afterClosed().subscribe(result => {
      if(result.status == 'Success'){
        console.log(result,'result')
        this.verifyOtpEnable = true;
        this.maskUserCode(result.data);
        this.startTimer();
        console.log(result.data,'result.data')
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

    this.loginService.sendOtpRequestApi(this.sendOtpReqBody)
        .subscribe({  
          next: (res:any)=>{
            console.log(res);
            localStorage.setItem("requestId", res?.requestId);
            this.toast.warning({ detail: "SUCCESS", summary: "Sent OTP again to "+this.maskedUserCode, duration: 3000 });
            this.startTimer();
          },
          error: (err => {
            console.log(err);
            this.toast.error({ detail: "ERROR", summary:err, sticky: true });
          })
        })
  }

  startTimer() {
    this.timeLeft = 60;
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

  onSubmit(){
    if(this.loginForm.valid){
      this.loginService.sendAgentLoginRequestApi(this.loginForm.value)
        .subscribe({  
          next: (res:any)=>{
            localStorage.setItem('userCode', this.loginForm.value.userName);
            window.open(res.data.redirectUrl, "_blank");
          },
          error: ((err:any) => {
            console.log(err);
            this.toast.error({ detail: "ERROR", summary:err, sticky: true });
          })
        })
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
      if (this.loginForm.invalid)
        this.toast.warning({ detail: "WARNING", summary: "Please fill the mandatory fields", duration: 3000 })
      else if (this.loginForm.get('nationality') && this.loginForm.get('nationality')?.value !== 'Indian')
        this.toast.warning({ detail: "WARNING", summary: "Indian residency is required", duration: 3000 })
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
    if (otpCode.length === 6 && /^[0-9]+$/.test(otpCode)) {
      console.log('OTP is valid: ', otpCode);  // Replace with your verification logic

      this.validateOtpReqBody.agentCode = localStorage.getItem("agentCode");
      this.validateOtpReqBody.requestId = localStorage.getItem("requestId");
      this.validateOtpReqBody.otpNumber = otpCode;

      console.log(this.validateOtpReqBody);

      this.loginService.validateOtpRequestApi(this.validateOtpReqBody)
        .subscribe({  
          next: (res:any)=>{
            console.log(res);
            if(res.isSuccess && res.token !== null && res.statusMessage === "OTP Successfully Validated") {
              this.loginService.storeToken(res.token);
              localStorage.setItem('agentcode', res.agentCode);
              // this.toast.success({ detail: "SUCCESS", summary: res.message, duration: 5000 })
              this.router.navigate(['dashboard']);
            } else {
              this.errorMessage = "Invalid/Expired OTP";
              // this.toast.warning({ detail: "WARNING", summary: "Invalid/Expired OTP", duration: 3000 })
            }
          },
          error: (err => {
            console.log(err);
            // this.toast.error({ detail: "ERROR", summary:err, sticky: true });
            this.errorMessage = err;
          })
        })
    } else {
      this.errorMessage = "Please enter valid OTP";
      // this.toast.warning({ detail: "WARNING", summary: "Please enter valid OTP", duration: 3000 })
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

  //filter for autocomplete
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  back(){
    this.searchMobileOrEmail = false;
  }
  onSearchMobileOrEmail(){
    this.searchMobileOrEmail = false;
    let data:any = {verify:this.myControl.value}
    this.codeForm.patchValue(data);
  }
}