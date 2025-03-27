import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNavbar: boolean = false;
  isLoading$ = this.loadingService.isLoading$;
  currentUrl: string = '';
  showTimer: boolean | undefined;

  constructor(private dialog: MatDialog, private router:Router, private loadingService: LoadingService, private authService: AuthService, private sessionService: SessionService){}
  ngOnInit(){
    // Subscribe to router events to handle route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        this.updateNavbarVisibility();
        this.checkLoginStatus();
        this.showTimerWithoutLogins();
      }
    });   
  }
  
  checkLoginStatus() {
    if (this.authService.isLoggedIn() && !this.authService.isSessionTokenExists()) {
      if (this.currentUrl === '/') {
        this.sessionService.broadcastLogout();
        this.sessionService.forceLogout();
      }
    }
  }
  
  updateNavbarVisibility() {
    if (this.currentUrl === '/' || this.isInvalidPath(this.currentUrl)) {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }

  showTimerWithoutLogins() {
    if(this.currentUrl !== '/' && this.isInvalidPath(this.currentUrl)){
      this.showTimer = true;
      this.sessionService.startSessionTimer();
    } else {
      this.showTimer = false;
    }
  }

  private isInvalidPath(url: string): boolean {
    const validPaths = [
      '/notifications',
      '/dashboard',
      '/leads',
      '/claims',
      '/events',
      '/endorsements',
      '/products',
      '/quote',
      '/yatra',
      '/rug',
      '/rug:leadId',
      '/renewal',
      '/customers',
      '/proposals',
      '/profile',
      '/declaration',
      '/performance',
      '/mycommissions',
      '/commission'
    ];
    const explicitInvalidPaths = [
      '/renewal/customerPayment', // Add more paths that should always hide the navbar
      '/yatra/customerKyc',
      '/renewal/customerKyc',
      '/yatra/customerPayment',
      '/renewal/kyc',
      '/renewal/payment',
      '/yatra/kyc',
      '/yatra/payment',
      '/proposals/shareconstent',
      '/proposals/shareSummary',
      '/rug/test-page',
      '/rug/customerDetails',
      '/rug/otpauthentication',
      '/products/hdfc',
      '/products/axis',
      '/rug/otpauthentication',
      '/yatra/hdfc',
      '/customer/memberTest'
    ];
    if (explicitInvalidPaths.some((path) => url.startsWith(path))) {
      return true;
    }
    return !validPaths.some((path) => url.startsWith(path));
  }
}
