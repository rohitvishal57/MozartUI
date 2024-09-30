import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdfsService } from 'src/app/services/adfs/adfs.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-status-validation',
  templateUrl: './status-validation.component.html',
  styleUrls: ['./status-validation.component.scss']
})
export class StatusValidationComponent implements OnInit {
  constructor(  
    private route: ActivatedRoute, 
    private adfsService:AdfsService,
    private toast: NgToastService,
    private loginService: LoginService, 
    private router: Router
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
            this.adfsService.checkADFSLogin(data,data.Idtoken).subscribe({
              next: (res:any) => {
                this.loginService.storeToken(res.data.token);
                localStorage.setItem('username', res.data.agentcode);
                localStorage.setItem('code', '2001');
                this.toast.success({
                  detail: 'SUCCESS',
                  summary: 'Login Successfull',
                  duration: 2000,
                });
                this.router.navigate(['portal/agent/viewdashboard']);
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
          this.adfsService.checkCyberArkLogin(data,data.Idtoken).subscribe({
            next: (res:any) => {
              this.loginService.storeToken(res.data.token);
              localStorage.setItem('username', res.data.agentcode);
              localStorage.setItem('code', '2001');
              this.toast.success({
                detail: 'SUCCESS',
                summary: 'Login Successfull',
                duration: 2000,
              });
              this.router.navigate(['portal/agent/viewdashboard']);
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
        }
        }else{
             this.router.navigate(['']);
             this.toast.error({
              detail: 'ERROR',
              summary: 'Some Error Occured! Please Try Again.',
              sticky: true,
            });
        }
      });
  }
  private extractIdToken(fragment: string): string | null {
    const params = new URLSearchParams(fragment);
    return params.get('id_token'); // Extracts id_token from fragment
  }
}
