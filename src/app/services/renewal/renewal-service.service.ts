import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '../../config.service';
@Injectable({
  providedIn: 'root'
})
export class RenewalServiceService { 
  private stateSource = new BehaviorSubject<{ button: string, value?: any }>({ button: 'primary' });
  state$ = this.stateSource.asObservable();
  private policyNo = new BehaviorSubject<{ policyNo: string }>({ policyNo: "" });
  policy$ = this.policyNo.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  updateState(button: string, value?: any) {
    this.stateSource.next({ button, value });
  }
  setPolicyNo(policyNo: string) {
    this.policyNo.next({ policyNo });
  }
  getRenewalListApi(reqBody: any) { 
    const getRenewalListApi = this.configService.config.baseUrl + this.configService.config.getRenewalListApi;
    return this.http.post<any>(getRenewalListApi, reqBody);
  }
  sendrenewalwhatappsms(reqBody: any) {
    const sendrenewalwhatappsms = this.configService.config.baseUrl+this.configService.config.sendrenewalwhatappsms;
    return this.http.post<any>(sendrenewalwhatappsms, reqBody);
  }
  sendrenewalsms(reqBody: any) {
    const sendrenewalsms = this.configService.config.baseUrl+this.configService.config.sendrenewalsms;
    return this.http.post<any>(sendrenewalsms, reqBody);
  }
  generatepaymentlink(reqBody: any) {
    const generatepaymentlink = this.configService.config.baseUrl+this.configService.config.generatepaymentlink;
    return this.http.post<any>(generatepaymentlink, reqBody);
  }
  getRenewalInfoApi(policyNumber: string, requestBody: any) {    
    const getRenewalInfoApi = `${this.configService.config.baseUrl+this.configService.config.getRenewalInfoApi}?policyNumber=${policyNumber}`; 
    return this.http.post<any>(getRenewalInfoApi, requestBody);
  }

}