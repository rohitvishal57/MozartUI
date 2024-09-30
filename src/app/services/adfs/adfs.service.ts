import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Injectable({
  providedIn: 'root'
})
export class AdfsService {
  constructor(private http: HttpClient, private configService: ConfigService) {}
  checkADFSLogin(loginData: any, token:any) {
    return this.http.post<any>(this.configService.config.baseUrl+this.configService.config.validateadfstoken+token, loginData);
  }
  checkCyberArkLogin(loginData: any, token:any) {
    return this.http.post<any>(this.configService.config.baseUrl+this.configService.config.validatecyberarktoken+token, loginData);
  }
}
