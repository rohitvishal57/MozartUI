import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';
interface PolicyState {
  policyNo: string;
  activeSection: string;
}

@Injectable({
  providedIn: 'root'
})
export class RenewalsService {

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

  private stateSource = new BehaviorSubject<{ button: string, value?: any }>({ button: 'primary' });
  state$ = this.stateSource.asObservable();
  private policyState = new BehaviorSubject<PolicyState>({ policyNo: "", activeSection: "" });
  policy$ = this.policyState.asObservable();
  private quote = new BehaviorSubject<any>({});
  quote$ = this.quote.asObservable();

  setQuote(quoteObject: any) {
    this.quote.next(quoteObject);
  }
  getQuote(): Observable<any> {
    return this.quote$;
  }
  

  updateState(button: string, value?: any) {
    this.stateSource.next({ button, value });
  }
  setPolicyState(policyNo: string, activeSection: string) {
    this.policyState.next({ policyNo, activeSection });
  }
  getRenewalListApi(reqBody: any) {
    const getRenewalList = this.configService.config.baseUrl + this.configService.config.getRenewalList;
    return this.httpService.post(getRenewalList, reqBody);
  }
  sendRenewalWhatsappApi(reqBody: any) {
    const sendrenewalwhatappsms = this.configService.config.baseUrl + this.configService.config.sendRenewalWhatappsms;
    return this.httpService.post(sendrenewalwhatappsms, reqBody);
  }
  sendRenewalsmsApi(reqBody: any) {
    const sendrenewalsms = this.configService.config.baseUrl + this.configService.config.sendRenewalsms;
    return this.httpService.post(sendrenewalsms, reqBody);
  }
  sendRenewalEmailApi(reqBody:any){
    const sendrenewalemail = this.configService.config.baseUrl + this.configService.config.sendRenewalEmail;
    return this.httpService.post(sendrenewalemail,reqBody);
  }
  generatePaymentlinkApi(reqBody: any) {
    const generatepaymentlink = this.configService.config.baseUrl + this.configService.config.generatePaymentlink;
    return this.httpService.post(generatepaymentlink, reqBody);
  }
  getRenewalInfoApi(policyNumber: string, requestBody: any) {
    const getRenewalInfo = `${this.configService.config.baseUrl + this.configService.config.getRenewalInfo}?policyNumber=${policyNumber}`;
    return this.httpService.post(getRenewalInfo, requestBody);
  }
  getSubquotesApi(policyNumber: string, requestBody: any){
    const getsubquotes = `${this.configService.config.baseUrl + this.configService.config.getSubquotes}?policyNumber=${policyNumber}`;
    return this.httpService.post(getsubquotes,requestBody);
  }
  updatenomineeApi(reqBody: any){
    const updatenominee = this.configService.config.baseUrl + this.configService.config.updatenominee;
    return this.httpService.post(updatenominee, reqBody);
  }
  updateaddressApi(reqBody: any){
    const updateaddress = this.configService.config.baseUrl + this.configService.config.updateaddress;
    return this.httpService.post(updateaddress, reqBody);
  }
  getproductdetailsandfeatures(reqBody: any){
    const getproductdetailsandfeatures = this.configService.config.baseUrl + this.configService.config.getproductdetailsandfeatures;
    return this.httpService.post(getproductdetailsandfeatures, reqBody);
  }
}
