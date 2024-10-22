import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentLanguage: string = 'en';
  isSidenavOpen: boolean = false;
  isDesktopView: boolean = window.innerWidth >= 768;
  @Input() isLoggedIn: any;

  constructor(private router: Router, private translate: TranslateService,
    private loginService: CommonService, private toast: NgToastService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.currentLanguage = this.getLanguage();
  }

  logOut() {
    this.toast.success({ detail: "SUCCESS", summary: "Agent Logout successfully!!", duration: 2000 });
    this.loginService.signOut();
    this.router.navigate(['']);
  }

  setLanguage(event: any) {
    localStorage.setItem('preferredLanguage', event.target.value);
    this.currentLanguage = event.target.value;
    this.translate.use(event.target.value);
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
    console.log('a', this.isSidenavOpen, this.isDesktopView);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktopView = window.innerWidth >= 768;
    if (this.isDesktopView) {
      this.isSidenavOpen = false;
    }
  }
  redirect(value: any) {
    this.router.navigate([value]);
  }

}

