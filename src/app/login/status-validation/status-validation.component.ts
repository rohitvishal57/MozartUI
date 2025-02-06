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
  token : any = '';

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

  checkADFSLogin() {
debugger
const url = new URL(window.location.href);
this.token = new URLSearchParams(url.hash.substring(1)).get('id_token');
    
    //let idToken: any = '';
    this.route.queryParams.subscribe(params => {
      let url: any = this.router.url.split('/');
      let data: any = {};
  
      if (params) {
        console.log(params, url);
  
        if (url.includes('adfs')) {
         // const token = "id_token";
          data.Idtoken = this.token // Get the token from queryParams
          data.username = localStorage.getItem('agentCode');
          this.loginService.checkADFSLogin(data, data.Idtoken, data.username).subscribe({
            next: (res: any) => {
              if (res.data && res.isSuccess && res.statusCode == '200') {
                this.navigateToDashboard(res);
              } else {
                this.navigateToLogin(res?.message);
              }
            },
            error: (err) => {
              this.navigateToLogin('ERR101 : Some Error Occurred! Please Try Again.');
            },
          });
        } else {
          const token = "code";
          data.Idtoken = params[token]; // Get the token from queryParams
          data.username = localStorage.getItem('agentCode');
          this.loginService.checkCyberArkLogin(data, data.Idtoken, data.username).subscribe({
            next: (res: any) => {
              if (res.data && res.isSuccess && res.statusCode == '200') {
                this.navigateToDashboard(res);
              } else {
                this.navigateToLogin(res?.message);
              }
            },
            error: (err) => {
              this.navigateToLogin('ERR102 : Some Error Occurred! Please Try Again.');
            },
          });
        }
      } else {
        this.navigateToLogin('ERR103 : Some Error Occurred! Please Try Again.');
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