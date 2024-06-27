import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/services/login.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-ncr-login',
  templateUrl: './ncr-login.component.html',
  styleUrls: ['./ncr-login.component.scss']
})
export class NcrLoginComponent {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder,private loginService: LoginService, private router: Router,
    private toast: NgToastService){
  }
  ngOnInit(){
    localStorage.clear()
    sessionStorage.clear()
    this.initializeForm();
  }
  initializeForm(){
    this.loginForm = this.fb.group({
      adminUserName: ['', Validators.required],
      adminPassword:['', Validators.required]
    })
  }
  onSubmit(){
    if(this.loginForm.valid){
      this.loginService.sendAdminLoginRequest(this.loginForm.value)
        .subscribe({  
          next: (res)=>{
            this.loginService.storeToken(res.token);
            this.toast.success({ detail:"Last Login",summary:`Last Successfull Login: ${new Date().toLocaleString()}`, duration: 5000 })
            this.router.navigate(['portal/cxp-core-webapp/dashboard']);
          },
          error: (err => {
            this.toast.error({ detail: "ERROR",summary:"Some Error Occured!", sticky: true });
          })
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}
