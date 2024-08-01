import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-bancassure',
  templateUrl: './bancassure.component.html',
  styleUrls: ['./bancassure.component.scss']
})
export class BancassureComponent implements OnInit {
  currentLanguage: string = 'en'; 
  isSidenavOpen: boolean = false;
  isDesktopView: boolean = window.innerWidth >= 768;

  constructor(private loginService: LoginService,private toast: NgToastService,
    private router: Router,public common: CommonService) {}

  ngOnInit() {
    this.currentLanguage = this.getLanguage();
  }

  logOut() {
    this.toast.success({ detail: "SUCCESS", summary: "Agent Logout successfully!!", duration: 2000 });
    this.loginService.signOut();
    this.router.navigate(['']);
  }

  setLanguage(event: any) {
    console.log(event);
    let language = event.target.value;
    localStorage.setItem('preferredLanguage', language);
    this.currentLanguage = language;
  }

  getLanguage(): string {
    // localStorage.setItem('preferredLanguage',  navigator.language.split('-')[0] || 'en');
    // return localStorage.getItem('preferredLanguage') ||'';
    const preferredLanguage = localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0] || 'en';
    localStorage.setItem('preferredLanguage', preferredLanguage);
    return preferredLanguage;
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    console.log('a',this.isSidenavOpen,this.isDesktopView);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth >= 768;
    if (this.isDesktopView) {
      this.isSidenavOpen = false;
    }
  }
}
