import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl: string = 'https://usp.monocept.ai/';
  // private baseUrl: string = 'http://20.235.250.168:8086/';

  constructor(private http: HttpClient, private router: Router, private configService: ConfigService) {}

  


  //Agent APi's
  sendAgentLoginRequestApi(loginData: any) {
    // const sendAgentLoginRequestApi = this.configService.config.baseUrl + this.configService.config.partnerlogin;
    return this.http.post<any>("https://localhost:7253/api/login", loginData);
  }

  Getagentcartdetails(reqData:any){
    const agentcartdetails = this.configService.config.baseUrl + this.configService.config.agentCartDetails 
    return this.http.post<any>(agentcartdetails,reqData);
  }
  Insertorupdateagentcartdetails(reqData: any) {
    const insertorupdateagentcartdetails = this.configService.config.baseUrl + this.configService.config.insertOrUpdateAgentCartDetails
    return this.http.post<any>(insertorupdateagentcartdetails, reqData);
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }
  isLoggedIn(): boolean {
    if (!!localStorage.getItem('token')) {
      return true;
    }
    return false;
  }
  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  

  // For Google Login 
  sendGoogleLoginRequest(reqBody: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/User/GoogleLogin`, reqBody);
  }

    // For Send OTP Login
    validateOtpRequestApi(validateOtpReqBody: any) {
      const validateOtpRequestApi = this.configService.config.baseUrl + this.configService.config.validateotp;
      return this.http.post<any>(validateOtpRequestApi, validateOtpReqBody);
    }

    sendOtpRequestApi(OtpReqBody: any) {
      const sendOtpRequestApi = this.configService.config.baseUrl + this.configService.config.sendotp;
      return this.http.post<any>(sendOtpRequestApi, OtpReqBody);
    }

    getContactDetailsByAgentCodeApi(contactDetailsReqBody: any) {
      const getContactDetailsByAgentCodeApi = this.configService.config.baseUrl + this.configService.config.getContactDetailsByAgentCode;
      return this.http.post<any>(getContactDetailsByAgentCodeApi, contactDetailsReqBody);
    }
}
