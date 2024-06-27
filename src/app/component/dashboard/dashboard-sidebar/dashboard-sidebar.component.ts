import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {
  stylesList:any[]=[];
  style :any;
  bankCode = localStorage.getItem('bankCode');
  userName = localStorage.getItem('username')?.toUpperCase();

  private dynamicStyle! : HTMLLinkElement;

  constructor(private renderer: Renderer2,  @Inject(DOCUMENT) private document: Document,
  private loginService:LoginService,private router: Router,private toast:NgToastService,private spinner:NgxSpinnerService)
  {}
  ngOnInit(): void {
    this.spinner.show();
    this.stylesList=[{bankCode:'1001',style:'yesbank-product.css'},{bankCode:'1002',style:'axisbank-product.css'},{bankCode:'1003',style:'icicibank-product.css'},{bankCode:'1004',style:'hdfcbank-product.css'},{bankCode:'1005',style:'kotakbank-product.css'},{bankCode:'1006',style:'indusindbank-product.css'},{bankCode:'1007',style:'rblbank-product.css'},{bankCode:'1008',style:'idfcfirstbank-product.css'},{bankCode:'1009',style:'dbsbank-product.css'}];
    this.style=this.stylesList.filter((style)=>style.bankCode==this.bankCode)[0].style;
    this.dynamciallyLoadCSS()
  }
  dynamciallyLoadCSS(){
    let tf: string = this.style;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle,'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle,'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle,'href', 'assets/styles/dashboard/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle)
    this.spinner.hide();
  }
  logOut(){
    this.toast.success({detail:"SUCCESS",summary:"User Logout successfully!!",duration:2000})
    this.loginService.signOut();
    this.router.navigate(['']);
  }
}
