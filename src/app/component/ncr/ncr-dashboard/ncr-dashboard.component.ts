import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ncr-dashboard',
  templateUrl: './ncr-dashboard.component.html',
  styleUrls: ['./ncr-dashboard.component.scss'],
})
export class NcrDashboardComponent {
  appName!:any;
  heading!:any;
  isMouseOver: boolean = false;
  isMouseOverSidebar: boolean = false;
  activeIndex!:any;
  activeSubIndex!:any

  menuItems: any[] = [];
  subMenuItems: any;

  constructor(private router:Router) {
    this.menuItems = [
      {
        id: 1,
        label: 'Master',
        subMenu: [
          { label: 'Branches' },
          { label: 'Channels' },
          { label: 'Corporate Clients' },
          { label: 'Currencies' },
          { label: 'Institutions' },
          { label: 'Key Management' },
          { label: 'Merchant Category Codes' },
          { label: 'Transactions' },
          { label: 'Country' },
        ],
      },
      { id: 2, label: 'Support' },
      { id: 3, label: 'Card Product' },
      { id: 4, label: 'Maker Checker' },
      { id: 5, label: 'Card Control' },
      { id: 7, label: 'Search' },
      { id: 7, label: 'Events' },
    ];
  }

  ngOnInit(): void {
    this.appName="AxC"
    this.heading=this.menuItems[0].label;
    this.activeIndex=0;
    this.activeSubIndex=0;
  }
  onSelectService(serviceId: any,index:any) {
    this.subMenuItems = [];
    this.subMenuItems = this.menuItems.find((x) => x.id == serviceId).subMenu;
    this.heading=this.menuItems.find((x) => x.id == serviceId).label;
    this.activeIndex=index;
  }
  onselectSubService(index:any,label:any){
    this.router.navigate([`/portal/cxp-core-webapp/dashboard`], {
      queryParams: {
        appName:this.appName,
        navigationcategory:this.heading,
        navigationitem: label
      }
    });
    this.activeSubIndex=index;
  }

  // For Side bar
  expandSidebar() {
    this.isMouseOver = true;
  }
  collapseSidebar() {
    this.isMouseOver = false;
  }
  expandSubSidebar() {
    this.isMouseOverSidebar = true;
  }
  collapseSubSidebar() {
    this.isMouseOverSidebar = false;
  }
}
