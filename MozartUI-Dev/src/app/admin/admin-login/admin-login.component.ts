import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import ValidateForm from 'src/app/validation/validateForm';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,public common:CommonService,
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
            console.log(res);
            this.loginService.storeToken(res.token);
            this.toast.success({ detail: "SUCCESS", summary: res.message, duration: 2000 })
            this.router.navigate(['portal/finaladminDashboard']);
          },
          error: (err => {
            this.toast.error({ detail: "ERROR", summary:err, sticky: true });
          })
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}
