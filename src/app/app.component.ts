import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-dev';

  showNavbar: boolean = true;

  constructor(private router:Router){

  }
  ngOnInit(){
    this.router.events.subscribe(() => {
      this.showNavbar = !this.router.url.includes('login');
      console.log(this.showNavbar);
    });
  }
}
