import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CommissionstatementService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  fetchCommissionStatement(requestBody: string) {
    const requestUrl = this.configService.config.baseUrl + this.configService.config.fetchCommmission;
    return this.http.post<any>(requestUrl, requestBody);
  }


  downloadCommissionStatement(requestBody: string) {
    const requestUrl = this.configService.config.baseUrl + this.configService.config.downloadCommmissionStatement;
    return this.http.post<any>(requestUrl, requestBody);
  }
}
