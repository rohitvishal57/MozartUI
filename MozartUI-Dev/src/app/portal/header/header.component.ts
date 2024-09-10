import { Component, Inject, OnInit, Renderer2} from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from 'src/app/services/login.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  headerStylesList:any[]=[];
  bankCode: any;
  dynamicFillColor: string='#000';
  style: any;
  private dynamicStyle!: HTMLLinkElement;
  constructor(private loginService:LoginService, private toast:NgToastService,
    private renderer: Renderer2,@Inject(DOCUMENT) private document: Document) {
  }
  ngOnInit(){
    this.bankCode=localStorage.getItem('bankCode');
    this.headerStylesList=[{bankCode:'1001',style:'yesbank-header.css'},{bankCode:'1002',style:'axisbank-header.css'},{bankCode:'1003',style:'icicibank-header.css'},{bankCode:'1004',style:'hdfcbank-header.css'},{bankCode:'1005',style:'kotakbank-header.css'},{bankCode:'1006',style:'indusindbank-header.css'},{bankCode:'1007',style:'rblbank-header.css'},{bankCode:'1008',style:'idfcfirstbank-header.css'},{bankCode:'1009',style:'dbsbank-header.css'}];
    this.style=this.headerStylesList.filter((style)=>style.bankCode==this.bankCode)[0]?.style || 'default.css';
    this.dynamciallyLoadCSS();
  }
  dynamciallyLoadCSS() {
    let tf: string = this.style;
    this.dynamicStyle = this.renderer.createElement('link');
    this.renderer.setAttribute(this.dynamicStyle, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.dynamicStyle, 'type', 'text/css');
    this.renderer.setAttribute(this.dynamicStyle, 'href', 'assets/styles/header/' + tf)
    this.renderer.appendChild(this.document.head, this.dynamicStyle)
  }
  logOut() {
    this.toast.success({detail:"SUCCESS",summary:"User Logout successfully!!",duration:2000})
    this.loginService.signOut();
  }
}
