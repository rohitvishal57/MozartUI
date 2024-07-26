import { Component, OnInit } from '@angular/core';
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

  setLanguage(language: string) {
    localStorage.setItem('preferredLanguage', language);
    this.currentLanguage = language;
  }

  getLanguage(): string {
    localStorage.setItem('preferredLanguage',  navigator.language.split('-')[0] || 'en');
    return localStorage.getItem('preferredLanguage') ||'';
  }
}
