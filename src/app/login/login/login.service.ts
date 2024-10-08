import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private configService: ConfigService,
    private httpService: HttpService  
  ) { }

  //Agent APi's
  sendAgentLoginRequestApi(loginData: any) {
    const sendAgentLoginRequestApi = this.configService.config.baseUrl + this.configService.config.partnerlogin;
    return this.httpService.post(sendAgentLoginRequestApi, loginData)
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  // For Send OTP Login
  validateOtpRequestApi(validateOtpReqBody: any) {
    const validateOtpRequestApi = this.configService.config.baseUrl + this.configService.config.validateotp;
    return this.httpService.post(validateOtpRequestApi, validateOtpReqBody);
  }

  sendOtpRequestApi(OtpReqBody: any) {
    const sendOtpRequestApi = this.configService.config.baseUrl + this.configService.config.sendotp;
    return this.httpService.post(sendOtpRequestApi, OtpReqBody);
  }

  getContactDetailsByAgentCodeApi(contactDetailsReqBody: any) {
    const getContactDetailsByAgentCodeApi = this.configService.config.baseUrl + this.configService.config.getContactDetailsByAgentCode;
    return this.httpService.post(getContactDetailsByAgentCodeApi, contactDetailsReqBody);
  }

  checkADFSLogin(loginData: any, token:any) {
    return this.httpService.post<any>(this.configService.config.baseUrl+this.configService.config.validateadfstoken+token, loginData);
  }

  checkCyberArkLogin(loginData: any, token:any) {
    return this.httpService.post<any>(this.configService.config.baseUrl+this.configService.config.validatecyberarktoken+token, loginData);
  }
}
