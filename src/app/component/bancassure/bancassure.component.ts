import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-bancassure',
  templateUrl: './bancassure.component.html',
  styleUrls: ['./bancassure.component.scss']
})
export class BancassureComponent {
    constructor(private loginService:LoginService,private toast:NgToastService,
        private router:Router
        ) { }
      ngOnInit(){
      }
      logOut() {
        this.toast.success({detail:"SUCCESS",summary:"Agent Logout successfully!!",duration:2000})
        this.loginService.signOut();
        this.router.navigate([''])
      }
}
