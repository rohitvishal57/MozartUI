import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent{
  constructor(private loginService:LoginService,private toast:NgToastService,
    private router:Router
    ) { }
    
  logOut() {
    this.toast.success({detail:"SUCCESS",summary:"Admin Logout successfully!!",duration:2000})
    this.loginService.signOut();
    this.router.navigate(['/admin'])
  }
}
