import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { ActivatedRoute } from '@angular/router';
import HeaderInformation from '../layout/headerInfo';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers:[HeaderInformation]
})
export class NotificationsComponent {

  agentCode:any;
  notifications :any;
  selectedView: any ='list'; 
  showNotifications : boolean = true;
  showActivies : boolean = false;


  constructor(private notificationService: NotificationService ,private route : ActivatedRoute,public headerInformation : HeaderInformation) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.agentCode = params['agentCode'];
      this.notificationInfo();
    });
  }

  backToPreviousPage() {
    window.history.back();
  }

  notificationInfo() {
    debugger;
    this.notificationService.fetchNotificationInfo(this.agentCode).subscribe(
      (response) => {
      this.notifications = response?.data;
      },
      error => {
        console.log('Failed to fetch notifications',error)
      });
  }

  
  renderView(view: string) {
    this.selectedView = view;
  }


  getNotifications(){
    this.showNotifications = true;
    this.showActivies = false;
  }

  getActivities(){
    this.showActivies = true;
    this.showNotifications = false;
  }


  formatDate(timestamp: any): string {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-CA');
    return formattedDate;
  }

  getNotificationIcon(notification: any) {
    const headerNotfication = this.headerInformation.notificationType.find((element: any) =>
      element.notificationType.includes(notification.module)
    );
    if (headerNotfication) {
      return headerNotfication.icon;
    }
    else {
      return;
    }
  }

}
