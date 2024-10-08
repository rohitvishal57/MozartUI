import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent {
  isExpanded = false;
  isActive = false;
  currentRoute: string = 'dashboard';
  
  constructor(private router:Router,
    private loginService: CommonService,private toast: NgToastService){

  }
  toggleMobileNav(event: Event): void {
    const target = (event.target as HTMLElement).getAttribute('aria-label');
    const element = document.getElementById(target || '');
    if (element) {
      this.isActive = !this.isActive;
    }
  }

  // Expand and collapse side navigation on hover
  expandSideNav(): void {
    this.isExpanded = true;
  }

  collapseSideNav(): void {
    this.isExpanded = false;
  }

  // Add class on smaller screens (mobile view)
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    if (width < 1024) {
      this.isExpanded = true;
    } else {
      this.isExpanded = false;
    }
  }

  // Initialize on component load
  ngOnInit(): void {
    if (window.innerWidth < 1024) {
      this.isExpanded = true;
    }
  }
  logOut() {
    this.toast.success({ detail: "SUCCESS", summary: "Agent Logout successfully!!", duration: 2000 });
    this.loginService.signOut();
    this.router.navigate(['']);
  }

  redirect(value:any){
    this.currentRoute = value; 
    this.router.navigate([value]);
  }
}
