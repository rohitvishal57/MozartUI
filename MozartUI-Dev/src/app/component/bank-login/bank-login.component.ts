import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, filter, takeUntil } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { LoginService } from 'src/app/services/login.service';
import ValidateForm from 'src/app/validation/validateForm';
import {ADConfig} from '../../../configuration'

@Component({
  selector: 'app-bank-login',
  templateUrl: './bank-login.component.html',
  styleUrls: ['./bank-login.component.scss'],
})
export class BankLoginComponent implements OnInit {
  @ViewChild('googleButton') googleButton!: ElementRef;
  
  bankLoginstylesList: any[] = [];
  headerStylesList: any[] = [];
  loginForm!: FormGroup;

  bankDetails: any;
  bankCode: any;
  verticalCode: any;
  showHtml: boolean = false;

  loginStyle: any;
  headerStyle: any;
  private dynamicStyle: HTMLLinkElement | null = null;

  ChannelBankMap: any;
  response: any;
  bankLoginConfiguration: any[] = [];
  loginConfiguration: any;

  validateOtp: boolean = false;
  otpTimer: number = 120;
  otpInterval: any;

  // For Microsoft MSAL
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private loginService: LoginService,
    private adminService: AdminService,
    private router: Router,
    private toast: NgToastService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}
  ngOnInit(): void {
    this.spinner.show();
    this.showHtml = false;
    this.bankLoginstylesList = [
      { bankCode: '1001', style: 'yesbank-login.css' },
      { bankCode: '1002', style: 'axisbank-login.css' },
      { bankCode: '1003', style: 'icicibank-login.css' },
      { bankCode: '1004', style: 'hdfcbank-login.css' },
      { bankCode: '1005', style: 'kotakbank-login.css' },
      { bankCode: '1006', style: 'indusindbank-login.css' },
      { bankCode: '1007', style: 'rblbank-login.css' },
      { bankCode: '1008', style: 'idfcfirstbank-login.css' },
      { bankCode: '1009', style: 'dbsbank-login.css' },
    ];
    this.headerStylesList = [
      { bankCode: '1001', style: 'yesbank-header.css' },
      { bankCode: '1002', style: 'axisbank-header.css' },
      { bankCode: '1003', style: 'icicibank-header.css' },
      { bankCode: '1004', style: 'hdfcbank-header.css' },
      { bankCode: '1005', style: 'kotakbank-header.css' },
      { bankCode: '1006', style: 'indusindbank-header.css' },
      { bankCode: '1007', style: 'rblbank-header.css' },
      { bankCode: '1008', style: 'idfcfirstbank-header.css' },
      { bankCode: '1009', style: 'dbsbank-header.css' },
    ];

    this.bankCode = localStorage.getItem('bankCode');
    this.bankDetails = history.state.bankDetails;
    this.verticalCode = history.state.verticalCode;
    this.loginConfiguration = JSON.parse(this.bankDetails.loginConfiguration);

    if (
      this.bankDetails == undefined ||
      this.bankDetails == null ||
      this.bankCode == undefined ||
      this.bankCode == null
    ) {
      this.router.navigate(['']);
    }
    this.getAllChennelBankMap();
    this.renderer.setStyle(
      this.el.nativeElement.ownerDocument.body,
      'background',
      '#ebebeb'
    );

    this.loginStyle =
      this.bankLoginstylesList.filter(
        (style) => style.bankCode == this.bankCode
      )[0].style || 'default.css';
    this.headerStyle =
      this.headerStylesList.filter(
        (style) => style.bankCode == this.bankCode
      )[0].style || 'default.css';
    this.dynamicallyLoadCSS();
    this.initializeForm();
    this.getLoginConfiguration();

    // For Microsoft MSAL
    this.msalAuthService.handleRedirectObservable().subscribe();

    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();

    this.msalAuthService.instance.enableAccountStorageEvents();
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        console.log(result);

        if (this.msalAuthService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });
  }
  getAllChennelBankMap(){
    this.adminService.getAllChannelBankMap().subscribe({
      next: (res)=>{
        this.ChannelBankMap=res.filter((map:any)=>map.bankCode==this.bankCode && map.verticalCode==this.verticalCode)[0];
        this.initializeForm();
      },
      error: (err) => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Some Error Occured! Please Try Again.',
          sticky: true,
        });
      },
    });
  }
  ngAfterViewInit() {
    // For Google Login
    // @ts-ignore
    google.accounts.id.initialize({
      client_id:
        '1037676707234-djnqlpqerr92hss4b9m1hsefhacq7hgm.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      // // @ts-ignore
      document.getElementById('google-button'),
      { theme: 'outline', size: 'large', width: 100 }
    );
  }
  async handleCredentialResponse(response: any) {
    let role="";
    if(this.verticalCode==12){
      role="BancaUser";
    }
    else if(this.verticalCode==13){
      role="Agent"
    }
    const reqBody={
      "googleAuth":response.credential,
      "role":role
    }
    this.loginService.sendGoogleLoginRequest(reqBody).subscribe({
      next: (res) => {
        this.loginService.storeToken(res.token);
        localStorage.setItem('username', res.userName);
        localStorage.setItem('verticalCode', this.verticalCode);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Login Successfull',
          duration: 2000,
        });
        this.router.navigate(['portal/banca/products']);
      },
      error: (err) => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Some Error Occured! Please Try Again.',
          sticky: true,
        });
      },
    });
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      bankCode: [this.bankCode, Validators.required],
      loginBy: ['', Validators.required],
      bancaUserName: [''],
      bancaPassword: [''],
      rmid: [''],
      mobileNumber: [''],
      otp: [''],
    });
    this.showHtml = true;
  }
  //For Dynamic Loading Css
  dynamicallyLoadCSS() {
    this.loadCSS(this.loginStyle, 'assets/styles/banklogin/');
    this.loadCSS(this.headerStyle, 'assets/styles/header/');
    this.spinner.hide();
  }
  loadCSS(cssFileName: string, directory: string) {
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(
      this.dynamicStyle,
      'href',
      directory + cssFileName
    );
    this.renderer.appendChild(this.document.head, this.dynamicStyle);
  }
  ngOnDestroy(): void {
    if (this.dynamicStyle) {
      const linkElement1 = this.renderer.selectRootElement(
        `link[href="assets/styles/banklogin/${this.loginStyle}"]`,
        true
      );
      const linkElement2 = this.renderer.selectRootElement(
        `link[href="assets/styles/header/${this.headerStyle}"]`,
        true
      );

      if (linkElement1 && linkElement2) {
        this.renderer.removeChild(this.document.head, linkElement1);
        this.renderer.removeChild(this.document.head, linkElement2);
        this.renderer.removeChild(this.document.head, this.dynamicStyle);
      }
    }
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginForm.removeControl('otp');
      this.loginForm.removeControl('mobileNumber');
      console.log(this.loginForm.value);
      this.loginService.sendLoginRequest(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.loginService.storeToken(res.token);
          localStorage.setItem('username', res.userName.split('@')[0]);
          localStorage.setItem('verticalCode', this.verticalCode);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Login Successfull',
            duration: 2000,
          });
          this.router.navigate(['portal/banca/products']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Some Error Occured!',
            sticky: true,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
  sendOtp() {
    if (this.loginForm.valid) {
      this.loginService.sendLoginRequest(this.loginForm.value).subscribe({
        next: (res) => {
          this.response = res;
          let mobileNumber = this.response.mobileNumber;
          if (
            mobileNumber != null &&
            mobileNumber != undefined &&
            mobileNumber != ''
          ) {
            this.loginForm
              .get('mobileNumber')
              ?.setValue(this.maskMobileNumber(mobileNumber));

            this.http
              .post(
                `https://enterprise.smsgupshup.com/GatewayAPI/rest?userid=2000231994&password=7zcrOdybO&method=TWO_FACTOR_AUTH&v=1.1&phone_no=${mobileNumber}&msg=Your%20One%20Time%20Password%20for%20mobile%20no%20verification%20of%20userid%20Monocept99%20is%20%25code%25&format=text&otpCodeLength=4&otpCodeType=NUMERIC`,
                {},
                {
                  responseType: 'text',
                }
              )
              .subscribe({
                next: (res) => {
                  this.toast.success({
                    detail: 'SUCCESS',
                    summary: `OTP Sent on this ${this.maskMobileNumber(
                      this.response.mobileNumber
                    )} Mobile Number Successfully.`,
                    duration: 2000,
                  });
                  this.validateOtp = true;
                  this.startOtpTimer();
                },
                error: (err) => {
                  console.error(err);
                  this.toast.error({
                    detail: 'ERROR',
                    summary: 'Some Error Happened!',
                    sticky: true,
                  });
                },
              });
          } else {
            this.toast.error({
              detail: 'ERROR',
              summary: 'Enter Correct Mobile Number!',
              sticky: true,
            });
          }
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Some Error Occured!',
            sticky: true,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
  submitOtp() {
    let mobileNumber = this.response.mobileNumber;
    let otp = this.loginForm.get('otp')?.value;
    if (
      mobileNumber != null &&
      mobileNumber != undefined &&
      mobileNumber != '' &&
      otp != null &&
      otp != undefined &&
      otp != ''
    ) {
      this.http
        .post(
          `https://enterprise.smsgupshup.com/GatewayAPI/rest?userid=2000231994&password=7zcrOdybO&method=TWO_FACTOR_AUTH&v=1.1&phone_no=${mobileNumber}&msg=Your%20One%20Time%20Password%20for%20mobile%20no%20verification%20of%20userid%20Monocept99%20is%20%25code%25&otp_code=${otp}&msg=hi`,
          {},
          {
            responseType: 'text',
          }
        )
        .subscribe({
          next: (res) => {
            this.stopOtpTimer();
            this.loginService.storeToken(this.response.token);
            localStorage.setItem('verticalCode', this.verticalCode);
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Login Successfull',
              duration: 2000,
            });
            this.router.navigate(['portal/dashboard/products']);
          },
          error: (err) => {
            console.error(err);
            this.toast.error({
              detail: 'ERROR',
              summary: 'Some Error Happened !',
              sticky: true,
            });
          },
        });
    } else {
      this.toast.error({
        detail: 'ERROR',
        summary: 'Enter Correct OTP.',
        sticky: true,
      });
    }
  }
  maskMobileNumber(value: any) {
    if (value) {
      const visibleDigits = 4;
      return (
        '*'.repeat(value.length - visibleDigits) + value.slice(-visibleDigits)
      );
    }
    return value;
  }
  startOtpTimer() {
    this.otpTimer = 120;
    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        clearInterval(this.otpInterval);
        this.validateOtp = false;
      }
    }, 1000);
  }
  stopOtpTimer() {
    clearInterval(this.otpInterval);
  }

  getLoginConfiguration() {
    this.bankLoginConfiguration = [];
    console.log(this.bankDetails);
    console.log(this.loginConfiguration);
    Object.keys(this.loginConfiguration).forEach((key) => {
      if (this.loginConfiguration[key]) {
        this.bankLoginConfiguration.push(key);
      }
    });
    if (this.bankLoginConfiguration.length > 0) {
      this.loginForm.get('loginBy')?.setValue(this.bankLoginConfiguration[0]);
    }
  }

  // For Microsoft MSAL
  triggerAzureAdLogin() {
    this.msalAuthService.loginPopup().subscribe(
      (response: AuthenticationResult) => {
        console.log(response);
        const idToken = response.idToken;
        const username:any= response.idTokenClaims;
        this.loginService.storeToken(idToken);
        localStorage.setItem('username',username.name);
        localStorage.setItem('verticalCode', this.verticalCode);
        this.router.navigate(['portal/banca/products']);
      },
      (error) => {
        console.error('Error during Azure AD login:', error);
      }
    );
  }

  setLoginDisplay() {
    this.loginDisplay =
      this.msalAuthService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.msalAuthService.instance.getActiveAccount();
    if (
      !activeAccount &&
      this.msalAuthService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.msalAuthService.instance.getAllAccounts();
      this.msalAuthService.instance.setActiveAccount(accounts[0]);
      console.log(accounts);
      console.log(this.msalAuthService.instance.getActiveAccount())
    }
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.msalAuthService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.msalAuthService.loginRedirect();
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.msalAuthService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.msalAuthService.instance.setActiveAccount(response.account);
        });
    } else {
      this.msalAuthService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.msalAuthService.instance.setActiveAccount(response.account);
        });
    }
  }
  
  logout(popup?: boolean) {
    if (popup) {
      this.msalAuthService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.msalAuthService.logoutRedirect();
    }
  }
}
