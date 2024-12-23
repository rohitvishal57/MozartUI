import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showNavbar: boolean = false;
  isLoading$ = this.loadingService.isLoading$;

  constructor(private router:Router, private loadingService: LoadingService){
   
  }
  ngOnInit(){
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl === '/' || this.isInvalidPath(currentUrl)) {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    });
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
      '/mycommissions'
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
      '/proposals/shareconstent'
    ];
    if (explicitInvalidPaths.some((path) => url.startsWith(path))) {
      return true;
    }
    return !validPaths.some((path) => url.startsWith(path));
  }
}
