import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgToastService } from 'ng-angular-popup';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'en';
  isSidenavOpen: boolean = false;
  isDesktopView: boolean = window.innerWidth >= 768;
  notificationCount: number = 1;
  notifications: any[] = [];
  showNotifications: Boolean = false;

  @Input() isLoggedIn: any;

  constructor(private router: Router,
    private loginService: CommonService, private toast: NgToastService, private el: ElementRef
  ) {
  }
  ngOnInit() {
    this.currentLanguage = this.getLanguage();
    this.notification();
    this.notificationCount = this.notifications.length;
  }


  ngOnDestroy() {
    //this.openNotifications();
    this.showNotifications = false;
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

  openNotifications() {
    this.showNotifications = this.showNotifications == false ? true : false;
  }

  closePopup(): void {
    this.showNotifications = false;
  }

  onPopupClick(event: MouseEvent): void {
    event.stopPropagation();  // Prevent the click from bubbling up to the overlay
  }

  // This will detect clicks outside the popup
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }

  notification() {
    this.notifications = [
      {
        message: 'You have a new comment on your post.',
        timestamp: new Date('2024-10-01T14:23:00'),
        type: 'comment',
        read: false
      },
      {
        message: 'Your order #12345 has been shipped.',
        timestamp: new Date('2024-10-02T09:45:00'),
        type: 'order',
        read: false
      },
      {
        message: 'You have a new follower: John Doe.',
        timestamp: new Date('2024-10-03T16:10:00'),
        type: 'follower',
        read: true
      }
    ];
  }

}

