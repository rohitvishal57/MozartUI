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
  isSideNavVisible = true
  formIndex:any
  docUrl = 'assets/verificationscript.doc';
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
   // { id: 12, displayName: 'My Commissions', path: '/mycommissions', imagePath: 'assets/Img/icon_menu_commissionstatment.png' }
  ];

  agentCode: any;
  public sidebarStateSubscription: any;
  constructor(
    private router: Router,
    private loginService: CommonService,
    private toast: NgToastService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.agentCode = localStorage.getItem('agentCode');
    this.formIndex = localStorage.getItem('formIndex');
    if(this.agentCode == '467896' && this.formIndex >= 8){
      this.isSideNavVisible = false
    }else if(this.agentCode == '467899'){
      this.isSideNavVisible = false
    }else if(this.agentCode == '467898'){
      this.isSideNavVisible = false
    }else{
      this.isSideNavVisible = true
    }
    console.log(this.agentCode)
    // if(this.agentCode == "467896"){
    //   this.sideMenuList = [
    //     { id: 1, displayName: 'Create Leads', path: 'rug', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 2, displayName: 'View Leads', path: 'rug/web', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     // { id: 3, displayName: 'Products', path: 'endorsements', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 3, displayName: 'Verification Script', path: 'rug/verification-script', imagePath: 'assets/Img/icon_products.svg' },
    //     { id: 4, displayName: 'Product Details', path: 'rug/productdownload', imagePath: 'assets/Img/icon_paper_grey.svg' },
    //     { id: 5, displayName: 'View Checker Leads', path: 'endorsements', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    
    //   ];
    // }
    // if(this.agentCode == "467894"){
    //   this.sideMenuList = [
    //     { id: 1, displayName: 'Base Caller Upload', path: 'rug/base-caller-upload', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 2, displayName: 'AV Upload', path: 'rug/av-upload', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 3, displayName: 'View For Solo Journey', path: 'rug/view-for-solo-journey', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 4, displayName: 'View UnVerified Leads', path: 'rug/view-unVerified-leads', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 5, displayName: 'View For Dual Journey', path: 'rug/view-for-dual-journey', imagePath: 'assets/Img/icon_products.svg' },        
    //     { id: 6, displayName: 'Verification Script', path: 'rug/verification-script', imagePath: 'assets/Img/icon_products.svg' },
    //     { id: 7, displayName: 'Product Details', path: 'rug/productdownload', imagePath: 'assets/Img/icon_paper_grey.svg' },
    //     { id: 8, displayName: 'Extract Base Agent & AV Master', path: 'rug/extract-base-agent', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    //     { id: 9, displayName: 'Manage LOB', path: 'rug/manage-LOB', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    //     { id: 10, displayName: 'Proposal/Policy View Details', path: 'rug/policy-view-details', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    
      // ];
    // }
    // if(this.agentCode == "467895"){
    //   this.sideMenuList = [
    //     { id: 1, displayName: 'AV Upload', path: 'rug/av_list', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 2, displayName: 'View For Solo Journey', path: 'rug/create_AV', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 3, displayName: 'View UnVerified Leads', path: 'rug/view-unVerified-leads', imagePath: 'assets/Img/icon_menu_boxes_grey.svg' },
    //     { id: 4, displayName: 'View For Dual Journey', path: 'rug/view-for-dual-journey', imagePath: 'assets/Img/icon_products.svg' },        
    //     { id: 5, displayName: 'Verification Script', path: 'rug/verification-script', imagePath: 'assets/Img/icon_products.svg' },
    //     { id: 6, displayName: 'Product Details', path: 'rug/productdownload', imagePath: 'assets/Img/icon_paper_grey.svg' },
    //     { id: 7, displayName: 'Extract Base Agent & AV Master', path: 'rug/extract-base-agent', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    //     { id: 8, displayName: 'Manage LOB', path: 'rug/manage-LOB', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    //     { id: 9, displayName: 'Proposal/Policy View Details', path: 'rug/policy-view-details', imagePath: 'assets/Img/icon_menu_calims_grey.svg' },
    
    //   ];
    // }
    // Fetch allowed pages from AuthService
    const allowedPages = this.authService.getAllowedModules();
    
    if (allowedPages.length > 0) {
      //this.sideMenuList = this.sideMenuList.filter(menuItem => allowedPages.includes(menuItem.displayName));
      this.sideMenuList=[];
      this.sideMenuList = allowedPages;
    }

    // Check initial expansion based on window width
    this.isExpanded = window.innerWidth < 1024;
    this.loginService.setValue(!this.isExpanded)
    this.sidebarStateSubscription = this.loginService.sidebarState$.subscribe((state: boolean) => {
      this.isExpanded = state;
      this.isActive = state;
      this.loginService.setValue(state)
    });
  }

  // Handle route redirection
  redirect(route: string): void {
    if (route) {
      console.log(route);
      if(route == "rug/verification_script"){
        const link = document.createElement('a');
        link.href = this.docUrl;
        link.download = 'verificationscript.doc';
        link.click();
      }else{
      // this.closeSidebar();
      console.log(this.loginService.getValue());
      // this.loginService.toggleSidebar(!this.loginService.getValue());
      this.router.navigate([route]);
      }
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
    this.toast.success({ detail: 'Success', summary: 'Agent Logout successfully!!', duration: 2000 });
    this.loginService.signOut();
    this.router.navigate(['']);
  }
  closeSidebar(){
    this.loginService.toggleSidebar(!this.loginService.getValue());
  }
}
