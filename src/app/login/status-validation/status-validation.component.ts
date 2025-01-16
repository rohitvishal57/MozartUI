import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from '../login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { BankbranchModalComponent } from 'src/app/shared/components/bankbranch-modal/bankbranch-modal.component';
import { Item } from 'src/app/interface/modal-popup.interface';

@Component({
  selector: 'app-status-validation',
  templateUrl: './status-validation.component.html',
  styleUrls: ['./status-validation.component.scss']
})
export class StatusValidationComponent implements OnInit {
  items: Item[] = [];

  constructor(  
    private route: ActivatedRoute, 
    private toast: NgToastService,
    private loginService: LoginService,
    public dialog: MatDialog,
    private authService: AuthService, 
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
          console.log(fragment, url);
          if(url.includes('adfs')){
              const token = "id_token";
              data.Idtoken = this.extractIdToken(fragment, token);
              data.username = localStorage.getItem('agentCode');
              this.loginService.checkADFSLogin(data,data.Idtoken, data.username).subscribe({
                next: (res:any) => {
                  if(res.data && res.isSuccess && res.statusCode == '200') {
                    this.navigateToDashboard(res);
                  } else {
                    this.navigateToLogin(res?.message);
                  }
                },
                error: (err) => {
                  this.navigateToLogin('Some Error Occured! Please Try Again.');
                },
              });
          }else{
            const token = "code";
            data.Idtoken = this.extractIdToken(fragment, token);
            data.username = localStorage.getItem('agentCode');
            this.loginService.checkCyberArkLogin(data,data.Idtoken,data.username).subscribe({
              next: (res:any) => {
                if(res.data && res.isSuccess && res.statusCode == '200') {
                  this.navigateToDashboard(res);
                } else {
                  this.navigateToLogin(res?.message);
                }
              },
              error: (err) => {
                this.navigateToLogin('Some Error Occured! Please Try Again.');
              },
            });
          }
        }else{
          this.navigateToLogin('Some Error Occured! Please Try Again.')
        }
    });
  }

  private extractIdToken(fragment: string, token: string): string | null {
    const params = new URLSearchParams(fragment);
    return params.get(token); // Extracts id_token from fragment
  }

  navigateToLogin(message: string) {
    this.router.navigate(['']);
    this.toast.error({
      detail: 'Error',
      summary: message,
      duration: 5000,
    });
  }

  navigateToDashboard(res: any) {
    localStorage.setItem('agentCode', res.data.agentCode);
    localStorage.setItem('userData', JSON.stringify(res.data));
    this.items = this.authService.getUserInfo()?.repotingMembers;
    res.data.isSelectionRequired && this.items.length > 0 ? this.openBankBranchDialog() : this.router.navigate(['dashboard']);
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
      this.router.navigate(['']);
    });
  }
  
}