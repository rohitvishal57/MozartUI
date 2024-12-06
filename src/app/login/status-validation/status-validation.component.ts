import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from '../login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
interface Item {
  firstName: string;
  agentCode: string;
}
@Component({
  selector: 'app-status-validation',
  templateUrl: './status-validation.component.html',
  styleUrls: ['./status-validation.component.scss']
})
export class StatusValidationComponent implements OnInit {
  @ViewChild('BankBranchDialog') BankBranchDialog!: TemplateRef<any>;
  items: Item[] = [];
  filteredList: Item[] = [];
  searchQuery: string = '';

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
          idToken = this.extractIdToken(fragment);
        if(url.includes('adfs')){
            data.Idtoken = idToken;
            data.username = localStorage.getItem('agentCode');
            this.loginService.checkADFSLogin(data,data.Idtoken, data.username).subscribe({
              next: (res:any) => {
                if(res.data && res.isSuccess && res.statusCode == '200') {
                  this.navigateToDashboard(res);
                } else {
                  this.router.navigate(['']);
                  this.toast.error({
                    detail: 'ERROR',
                    summary: 'Some Error Occured! Please Try Again.',
                    duration: 5000,
                  });
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
        }else{
          data.Idtoken = idToken;
          data.username = localStorage.getItem('agentCode');
          this.loginService.checkCyberArkLogin(data,data.Idtoken,data.username).subscribe({
            next: (res:any) => {
              if(res.data && res.isSuccess && res.statusCode == '200') {
                this.navigateToDashboard(res);
              } else {
                this.navigateToLogin();
              }
            },
            error: (err) => {
              this.navigateToLogin();
            },
          });
        }
        }else{
          this.navigateToLogin()
        }
      });
  }

  private extractIdToken(fragment: string): string | null {
    const params = new URLSearchParams(fragment);
    return params.get('id_token'); // Extracts id_token from fragment
  }

  navigateToLogin() {
    this.router.navigate(['']);
    this.toast.error({
      detail: 'ERROR',
      summary: 'Some Error Occured! Please Try Again.',
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
    this.filteredList = [...this.items]
    this.dialog.open(this.BankBranchDialog, {
      width: '600px',
      height: 'auto',
    });
  }

  filterList() {
    this.filteredList = this.items.filter(
      (item) =>
        item.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.agentCode.includes(this.searchQuery)
    );
  }

  selectItem(item: any) {
    localStorage.setItem('agentCode', item.agentCode);
    this.dialog.closeAll();
    this.router.navigate(['dashboard']);
  }

  closeDialogAndRedirect(): void {
    this.dialog.closeAll();
  }
}