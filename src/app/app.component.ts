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

  showNavbar: boolean = true;
  isLoading$: Observable<boolean>;

  constructor(private router:Router, private loadingService: LoadingService){
    this.isLoading$ = this.loadingService.isLoading;
  }
  ngOnInit(){
    this.router.events.subscribe(() => {
      this.showNavbar = !this.router.url.includes('login');
      // console.log(this.showNavbar);
    });
  }
}
