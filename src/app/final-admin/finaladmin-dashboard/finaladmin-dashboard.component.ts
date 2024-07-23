import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-finaladmin-dashboard',
  templateUrl: './finaladmin-dashboard.component.html',
  styleUrls: ['./finaladmin-dashboard.component.scss']
})
export class FinaladminDashboardComponent {

  constructor(private loginService:LoginService,private toast:NgToastService,public common:CommonService,
    private router:Router, private adminService:AdminService
    ) { }
  ngOnInit(){
    

  }
  logOut() {
    this.toast.success({detail:"SUCCESS",summary:"Admin Logout successfully!!",duration:2000})
    this.loginService.signOut();
    this.router.navigate(['/admin'])
  }

}
