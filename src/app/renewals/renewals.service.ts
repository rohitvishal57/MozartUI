import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class RenewalsService {

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

  private stateSource = new BehaviorSubject<{ button: string, value?: any }>({ button: 'primary' });
  state$ = this.stateSource.asObservable();
  private policyNo = new BehaviorSubject<{ policyNo: string }>({ policyNo: "" });
  policy$ = this.policyNo.asObservable();


  updateState(button: string, value?: any) {
    this.stateSource.next({ button, value });
  }
  setPolicyNo(policyNo: string) {
    this.policyNo.next({ policyNo });
  }
  getRenewalListApi(reqBody: any) {
    const getRenewalListApi = this.configService.config.baseUrl + this.configService.config.getRenewalListApi;
    return this.httpService.post(getRenewalListApi, reqBody);
  }
  sendrenewalwhatappsms(reqBody: any) {
    const sendrenewalwhatappsms = this.configService.config.baseUrl + this.configService.config.sendrenewalwhatappsms;
    return this.httpService.post(sendrenewalwhatappsms, reqBody);
  }
  sendrenewalsms(reqBody: any) {
    const sendrenewalsms = this.configService.config.baseUrl + this.configService.config.sendrenewalsms;
    return this.httpService.post(sendrenewalsms, reqBody);
  }
  generatepaymentlink(reqBody: any) {
    const generatepaymentlink = this.configService.config.baseUrl + this.configService.config.generatepaymentlink;
    return this.httpService.post(generatepaymentlink, reqBody);
  }
  getRenewalInfoApi(policyNumber: string, requestBody: any) {
    const getRenewalInfoApi = `${this.configService.config.baseUrl + this.configService.config.getRenewalInfoApi}?policyNumber=${policyNumber}`;
    return this.httpService.post(getRenewalInfoApi, requestBody);
  }

}
