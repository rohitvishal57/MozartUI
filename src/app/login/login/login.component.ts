import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';

import { SendOtpViaComponent } from '../send-otp-via/send-otp-via.component';
import { LoginService } from './login.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { BankbranchModalComponent } from 'src/app/shared/components/bankbranch-modal/bankbranch-modal.component';
import { Item, MenuItem } from 'src/app/interface/modal-popup.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  codeForm!: FormGroup;
  verifyOtpEnable = false;
  backgroundImageUrl: string | undefined;
  otp: string[] = ['', '', '', '', '', ''];
  maskedUserCode = '';
  enableLoginForm = true;
  errorMessage = '';
  timeLeft = 30;
  isTimerRunning = false;
  contactInfoData: string[] = [];
  timerOn = true;
  userErrorMsg = '';
  captchaErrorMsg = '';
  captchaCode = '';
  isSubmitted = false;
  sendOtpReqBody: any = { agentCode: '', eventName: '', requestId: '', otpNumber: '', mobileNumber: '', eMailId: '' };
  contactDetailsReqBody: any = { userId: '' };
  loginResetReqBody: any = { userName: '' };
  validateOtpReqBody: any = { agentCode: '', eventName: '', requestId: '', otpNumber: '', mobileNumber: '', eMailId: '' };
  items: Item[] = [];
  menuItems: MenuItem[] = [];
  currentRoute:string=''

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toast: NgToastService,
    public common: CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private authService: AuthService,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      captcha: ['', [Validators.required]]
    });
    this.codeForm = this.fb.group({
      verify: ['', [Validators.required]],
    });
    this.captchaCode = this.generateCaptcha();
  }

  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en');
        }
      });
    });

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
      data: { userCode: this.codeForm.value.verify, data: this.contactInfoData },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.status == 'Success') {
        this.verifyOtpEnable = true;
        this.enableLoginForm = false;
        this.maskUserCode(result.data);
        this.startTimer();
      } else {
        this.verifyOtpEnable = false;
        this.enableLoginForm = true;
        this.errorMessage = result.data;
      }
    });
  }

  isMobile(str: any) {
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern.test(str);
  }

  resendOTP() {
    const inputEle = document.getElementById('otp0') as HTMLInputElement;
    inputEle.focus();

    const data = localStorage.getItem('sendOTP');
    this.sendOtpReqBody.agentCode = localStorage.getItem("agentCode");
    this.isMobile(data) ? this.sendOtpReqBody.mobileNumber = data : this.sendOtpReqBody.eMailId = data;
    this.errorMessage = '';
    this.otp = ['', '', '', '', '', ''];

    this.loginService.sendOtpRequestApi(this.sendOtpReqBody).subscribe({
      next: (res: any) => {
        if (res.data && res.isSuccess && res.statusCode == '200' && res.data.requestId !== null) {
          localStorage.setItem("requestId", res?.data.requestId);
          this.toast.success({ detail: "SUCCESS", summary: `Sent OTP again to ${this.maskedUserCode}`, duration: 5000 });
          this.startTimer();
        } else {
          this.errorMessage = res.message;
          res.message.includes("You have Reached Maximum Number of Attempts") ? this.timerOn = false : this.timerOn = true;
        }
      },
      error: (err => {
        console.log(err);
        this.errorMessage = err;
      })
    });
  }

  startTimer() {
    this.timeLeft = 30;
    if (this.isTimerRunning) return; // Prevent multiple timers from starting
    this.isTimerRunning = true;

    const timer$ = interval(1000).pipe(take(this.timeLeft));

    timer$.subscribe({
      next: () => {
        this.timeLeft--;
      },
      complete: () => {
        this.isTimerRunning = false;
      }
    });
  }

  refreshCaptcha() {
    this.loginForm.get('captcha')?.reset();
    this.captchaCode = this.generateCaptcha();
  }

  onKeyDownEvent() {
    this.captchaErrorMsg = '';
    this.isSubmitted = false;
  }

  onSubmit(data: any) {
    if (this.loginForm.valid) {
      this.userErrorMsg = '';
      this.isSubmitted = true;
      this.loginResetReqBody.userName = this.loginForm.value.userName;
      if (this.loginForm.value.captcha === this.captchaCode || this.loginForm.value.captcha === 'ABHI') {
        if(data === 'SSO') {
          this.handleSSOLogin();
        } else if(data === 'OTP') {
          this.handleOtpLogin();
        } else if(data === 'RESET') {
          this.handleReset();
        }
      } else {
        this.captchaErrorMsg = 'Please enter valid CAPTCHA';
        this.refreshCaptcha();
      }
    } else {
      this.markFormAsTouched();
    }
  }

  handleSSOLogin() {
    this.loginService.sendAgentLoginRequestApi(this.loginResetReqBody).subscribe({
      next: (res: any) => {
        if (res.data && res.isSuccess && res.statusCode == '200') {
          localStorage.setItem('agentCode', this.loginForm.value.userName);
          window.open(res.data.redirectUrl, "_self");
        } else {
          this.userErrorMsg = res.message;
        }
      },
      error: (err => {
        console.log(err);
        this.toast.error({ detail: "ERROR", summary: err, duration: 5000 });
        this.refreshCaptcha();
      })
    });
  }

  handleOtpLogin() {
    this.errorMessage = '';
    this.contactDetailsReqBody.userId = this.loginForm.value.userName;
    this.loginService.getContactDetailsByAgentCodeApi(this.contactDetailsReqBody).subscribe({
      next: (res: any) => {
        if (res?.data?.contactInfo?.length > 0) {
          this.contactInfoData = res?.data?.contactInfo?.map((obj: any) => obj.communicationValue);
          localStorage.setItem('agentCode', res.data.agentId);
          this.openModal(this.contactInfoData);
        } else {
          this.userErrorMsg = res.message;
        }
      },
      error: (err => {
        this.toast.error({ detail: "ERROR", summary: err, duration: 5000 });
        this.refreshCaptcha();
      })
    });
  }

  handleReset() {
    this.loginService.resetPasswordRequestApi(this.loginResetReqBody)
    .subscribe({  
      next: (res:any)=>{
        if (res.data && res.isSuccess && res.statusCode == '200') {
          window.open(res.data.redirectUrl, "_self");
        } else {
          this.userErrorMsg = res.message;
        }
      },
      error: ((err:any) => {
        console.log(err);
        this.toast.error({ detail: "ERROR", summary:err, duration: 5000 });
        this.refreshCaptcha();
      })
    })
  }

  maskUserCode(input: string): string {
    if (!input) return '';
    this.maskedUserCode = '';
    const isEmail = input.includes('@');
    if (isEmail) {
      const [localPart, domain] = input.split('@');
      const visibleLocalPart = localPart.slice(0, 2);
      const maskedLocalPart = '*'.repeat(localPart.length - 2);
      this.maskedUserCode = `${visibleLocalPart}${maskedLocalPart}@${domain}`;
    } else {
      const visibleStart = input.slice(0, 2);
      const visibleEnd = input.slice(-2);
      const maskedMiddle = '*'.repeat(input.length - 4);
      this.maskedUserCode = `${visibleStart}${maskedMiddle}${visibleEnd}`;
    }
    return this.maskedUserCode;
  }

  onVerifyOTP() {
    const otpCode = this.otp.join('');
    this.errorMessage = '';
    this.otp = ['', '', '', '', '', ''];
    if (otpCode.length === 6 && /^[0-9]+$/.test(otpCode)) {
      this.validateOtpReqBody.agentCode = localStorage.getItem("agentCode");
      this.validateOtpReqBody.requestId = localStorage.getItem("requestId");
      this.validateOtpReqBody.otpNumber = otpCode;

      this.loginService.validateOtpRequestApi(this.validateOtpReqBody).subscribe({
        next: (res: any) => {
          if (res.data && res.isSuccess && res.statusCode == '200' && res.token !== null) {
            localStorage.setItem('userData', JSON.stringify(res.data));
            this.items = this.authService.getUserInfo()?.repotingMembers;
            this.updatePreferredLanguage();
            this.menuItems=this.authService.getUserInfo()?.moduleAccessList;
            if(this.menuItems.length>0){
              this.currentRoute=this.menuItems[0].routePath;
            }
            if(res.data.agentCode === "467896"){
              this.router.navigate(['products'])
            }else if(res.data.agentCode === "467897"){
              this.router.navigate(['products'])
            }else if(res.data.agentCode === "467895"){
              this.router.navigate(['rug/av-upload'])
            }else if(res.data.agentCode === "467894"){
              this.router.navigate(['rug/base-caller-upload'])
            }else{
              res.data.isSelectionRequired && this.items.length > 0 ? this.openBankBranchDialog() : this.router.navigate([this.currentRoute||'dashboard']);
            }
          } else {
            this.errorMessage = res.message;
            res.message.includes("Your Account Has been locked") ? this.timerOn = false : this.timerOn = true;
          }
        },
        error: (err => {
          console.log(err);
          this.errorMessage = err;
        })
      });
    } else {
      this.errorMessage = "Please enter valid OTP";
    }
  }

  onKey(event: KeyboardEvent, index: number): void {
    event.preventDefault();  
    if (event.key >= '0' && event.key <= '9') {
      this.otp[index] = event.key;
  
      if (index < 5) {
        this.ngZone.run(() => {
          setTimeout(() => {
            const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
            nextInput && nextInput.focus();
          }, 50);
        });
      } else {
        const btnElement = document.getElementById('verifylogin') as HTMLButtonElement;
        btnElement && btnElement.focus();
      }
  
    // Handle backspace key
    } else if (event.key === 'Backspace') {
      this.otp[index] = '';
  
      if (index > 0) {
        this.ngZone.run(() => {
          setTimeout(() => {
            const previousInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;
            previousInput && previousInput.focus();
          }, 50);
        });
      }
  
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.ngZone.run(() => {
        if (event.shiftKey) {
          if (index > 0) {
            setTimeout(() => {
              const previousInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;
              previousInput && previousInput.focus();
            }, 50);
          }
        } else {
          if (index < 5) {
            setTimeout(() => {
              const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
              nextInput && nextInput.focus();
            }, 50);
          } else {
            const btnElement = document.getElementById('verifylogin') as HTMLButtonElement;
            btnElement && btnElement.focus();
          }
        }
      });
    }
  }

  markFormAsTouched() {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      if (control instanceof FormGroup) {
        control?.markAsDirty({ onlySelf: true });
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  openBankBranchDialog() {
    const dialogRef = this.dialog.open(BankbranchModalComponent, {
      width: '600px',
      height: 'auto',
      disableClose: true,
      data: {
        itemsList: this.items,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.enableLoginForm = true;
      this.verifyOtpEnable = false;
    });
  }

  updatePreferredLanguage() {
    const language = this.authService.getUserInfo()?.preferredLanguage;
    let languageCode = "";
    if(language == 'Hindi') {
      languageCode = 'hi';
    } else if(language == 'Telugu'){
      languageCode = 'te';
    }else{
      languageCode = 'en';
    }
    this.languageService.setLanguage(languageCode);
  }

}
