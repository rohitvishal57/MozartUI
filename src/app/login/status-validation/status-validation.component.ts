import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-status-validation',
  templateUrl: './status-validation.component.html',
  styleUrls: ['./status-validation.component.scss']
})
export class StatusValidationComponent implements OnInit {
  constructor(  
    private route: ActivatedRoute, 
    private toast: NgToastService,
    private loginService: LoginService, 
    private router: Router,
  ){

  }
  ngOnInit(): void {
   this.checkADFSLogin();
  }
  checkADFSLogin(){
       let idToken:any = '';
       this.route.fragment.subscribe(fragment => {
        let url:any = this.router.url.split('/');
        let data:any = {}
        if (fragment) {
          idToken = this.extractIdToken(fragment);
        console.log( url,'fragment')
        if(url.includes('adfs')){
            data.Idtoken = idToken;
            data.username = localStorage.getItem('agentCode');
            this.loginService.checkADFSLogin(data,data.Idtoken, data.username).subscribe({
              next: (res:any) => {
                if(res.data && res.isSuccess && res.statusCode == '200') {
                  localStorage.setItem('agentCode', res.data.agentcode);
                  this.toast.success({
                    detail: 'SUCCESS',
                    summary: 'Login Successfull',
                    duration: 5000,
                  });
                  this.router.navigate(['dashboard']);
                }
              },
              error: (err) => {
               this.router.navigate(['']);
                this.toast.error({
                  detail: 'ERROR',
                  summary: 'Some Error Occured! Please Try Again.',
                  sticky: true,
                });
              },
            });
        }else{
          data.Idtoken = idToken;
          data.username = localStorage.getItem('agentCode');
          this.loginService.checkCyberArkLogin(data,data.Idtoken,data.username).subscribe({
            next: (res:any) => {
              if(res.data && res.isSuccess && res.statusCode == '200') {
                localStorage.setItem('agentCode', res.data.agentcode);
                this.toast.success({
                  detail: 'SUCCESS',
                  summary: 'Login Successfull',
                  duration: 5000,
                });
                this.router.navigate(['dashboard']);
              }
            },
            error: (err) => {
             this.router.navigate(['']);
              this.toast.error({
                detail: 'ERROR',
                summary: 'Some Error Occured! Please Try Again.',
                duration: 5000,
              });
            },
          });
        }
        }else{
             this.router.navigate(['']);
             this.toast.error({
              detail: 'ERROR',
              summary: 'Some Error Occured! Please Try Again.',
              duration: 5000,
            });
        }
      });
  }
  private extractIdToken(fragment: string): string | null {
    const params = new URLSearchParams(fragment);
    return params.get('id_token'); // Extracts id_token from fragment
  }
}