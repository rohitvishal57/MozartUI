import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { NgToastService } from 'ng-angular-popup';
import { Subject, filter, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import ValidateForm from 'src/app/validation/validateForm';


@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginComponent implements OnInit{
  @ViewChild('googleButton') googleButton!: ElementRef;

  loginForm!: FormGroup;
  verticalCode: any;
  //for Microsoft Login
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  passwordFieldType: string='password';
  backgroundImageUrl: string | undefined;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,
    private toast: NgToastService,@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService,public common:CommonService){
  }
  ngOnInit(){
    this.backgroundImageUrl = "common.baseCssUrl + 'assets/logo/Backgroundimage_ABHI.jpg'"; 
    localStorage.clear()
    sessionStorage.clear()
    this.loginForm = this.fb.group({
      agentUserName: ['', [Validators.required]],
      agentPassword: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9@.]*$/),Validators.maxLength(20),Validators.minLength(5)]]
    })
    this.verticalCode = 13;
    console.log(this.verticalCode);
    
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
        console.log(res);
        
        this.loginService.storeToken(res.token);
        localStorage.setItem('username', res.userName);
        localStorage.setItem('verticalCode', this.verticalCode);
        localStorage.setItem('code', '2001');
        console.log(localStorage.getItem('username'),localStorage.getItem('verticalCode'));
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Login Successfull',
          duration: 2000,
        });
        this.router.navigate(['portal/agent/viewdashboard']);
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

  togglePasswordVisibility(): void {
    console.log("hello hide here");
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // For Microsoft MSAL
  triggerAzureAdLogin() {
    this.msalAuthService.loginPopup().subscribe(
      (response: AuthenticationResult) => {
        console.log(response);
        const idToken = response.idToken;
        const username:any= response.idTokenClaims;
        console.log(username);
        this.loginService.storeToken(idToken);
        localStorage.setItem('agentUserName',username.name);
        localStorage.setItem('verticalCode', this.verticalCode);
        localStorage.setItem('code', '2001');
        this.router.navigate(['portal/agent/viewdashboard']);
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

  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.loginService.sendAgentLoginRequest(this.loginForm.value)
        .subscribe({  
          next: (res)=>{
            console.log(res);
            
            this.loginService.storeToken(res.token);
            localStorage.setItem('username', res.userName.split('@')[0] );
            localStorage.setItem('code', res.agencyCode);
            localStorage.setItem('agentCode', res.agentCode);
            localStorage.setItem('verticalCode', this.verticalCode);
            this.toast.success({ detail: "SUCCESS", summary: res.message, duration: 5000 })
            this.router.navigate(['portal/agent/viewproducts']);
          },
          error: (err => {
            console.log(err);
            this.toast.error({ detail: "ERROR", summary:err, sticky: true });
          })
        })
    }
    // else {
    //   ValidateForm.validateAllFormFields(this.loginForm);
    // }
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
}
