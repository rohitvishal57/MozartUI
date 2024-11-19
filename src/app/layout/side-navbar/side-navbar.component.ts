import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent {
  isExpanded = false;
  isActive = false;

  sideMenuList = [
    { id: 1, displayName: 'Dashboard', path: 'dashboard', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    { id: 2, displayName: 'Products', path: 'products', imagePath: 'assets/Img/icon_products.svg' },
    { id: 3, displayName: 'Endorsements', path: 'endorsements', imagePath: 'assets/Img/icon_paper_grey.svg' },
    { id: 4, displayName: 'Claims', path: 'claims/claimsList', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    { id: 5, displayName: 'My Leads', path: 'leads/leadsList', imagePath: 'assets/Img/icon_healthcare_grey.svg' },
    { id: 6, displayName: 'Renewals', path: 'renewal/renewalList', imagePath: 'assets/Img/icon_bullet_list_grey.svg' },
    { id: 7, displayName: 'Customers', path: 'customers/customersList', imagePath: 'assets/Img/icon_menu_customers_grey.svg' },
    { id: 8, displayName: 'Proposals', path: 'proposals/proposalsList', imagePath: 'assets/Img/icon_menu_proposal.png' },
    { id: 9, displayName: 'My Performance', path: 'performance/my-performance', imagePath: 'assets/Img/icon_menu_performance.png' },
    // { id: 10, displayName: 'Upload Report', path: 'performance/upload-performance', imagePath: 'assets/Img/icon_menu_uploadreports.png' },
    { id: 11, displayName: 'Events', path: 'events/eventsList', imagePath: 'assets/Img/icon_menu_events.png' },

  ];
  agentCode: any;
  constructor(
    private router: Router,
    private loginService: CommonService,
    private toast: NgToastService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.agentCode = localStorage.getItem('agentCode')
    // Fetch allowed pages from AuthService
    const allowedPages = this.authService.getAllowedModules();
    
    if (allowedPages.length > 0) {
      this.sideMenuList = this.sideMenuList.filter(menuItem => allowedPages.includes(menuItem.displayName));
    }

    // Check initial expansion based on window width
    this.isExpanded = window.innerWidth < 1024;
  }

  // Handle route redirection
  redirect(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  // Toggle mobile navigation
  toggleMobileNav(event: Event): void {
    const target = (event.target as HTMLElement).getAttribute('aria-label');
    const element = document.getElementById(target || '');
    if (element) {
      this.isActive = !this.isActive;
    }
  }

  // Check if the route is active
  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
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
    this.isExpanded = width < 1024;
  }

  // Handle user logout
  logOut(): void {
    this.toast.success({ detail: 'SUCCESS', summary: 'Agent Logout successfully!!', duration: 2000 });
    this.loginService.signOut();
    this.router.navigate(['']);
  }
}
