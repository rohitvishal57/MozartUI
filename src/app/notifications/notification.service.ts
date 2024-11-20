import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient, private configService: ConfigService, private httpService: HttpService) { }

  fetchNotificationInfo(agentCode: string) {
    const url = `${this.configService.config.baseUrl}${this.configService.config.getNotification}${agentCode}`;
    return this.http.post<any>(url, agentCode);
  }

  markAllNotification(agentCode: string) {
    const url = `${this.configService.config.baseUrl}${this.configService.config.markAllReadNotifications}${agentCode}`;
    return this.http.post<any>(url, agentCode);
  }

  
  markNotification(notificationId: string) {
    const url = `${this.configService.config.baseUrl}${this.configService.config.markNotification}${notificationId}`;
    return this.http.post<any>(url, notificationId);
  }
}
