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
  private paymentStatus: string = '';

  constructor(private configService: ConfigService,private httpService: HttpService) { }

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
  setPaymentStatus(status: string): void {
    this.paymentStatus = status;
  }
  getPaymentStatus(): string {
    return this.paymentStatus;
  }
  clearPaymentStatus(): void {
    this.paymentStatus = '';
  }
  updateState(button: string, value?: any) {
    this.stateSource.next({ button, value });
  }
  setPolicyState(policyNo: string, activeSection: string) {
    this.policyState.next({ policyNo, activeSection });
  }
  getRenewalListApi(reqBody: any) {
    const getRenewalList = this.configService.config.baseUrl1 + this.configService.config.getRenewalList;
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
  getRenewalInfoApi(requestBody: any) {
    const getrenewalinfo = this.configService.config.baseUrl1 + this.configService.config.getRenewalInfo;
    return this.httpService.post(getrenewalinfo, requestBody);
  }
  getTenureDetailsApi(reuestBody: any){
    const gettenuredetails = this.configService.config.baseUrl1 + this.configService.config.getTenureDetails;
    return this.httpService.post(gettenuredetails,reuestBody)
  }
  getSubquotesApi(requestBody: any){
    const getsubquotes = this.configService.config.baseUrl + this.configService.config.getSubquotes;
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
  updateBankDetailsApi(reqBody:any){
    const updateBankDetails= this.configService.config.baseUrl + this.configService.config.updateBankDetails
    return this.httpService.post(updateBankDetails,reqBody)
  }
  getproductdetailsandfeatures(reqBody: any){
    const getproductdetailsandfeatures = this.configService.config.baseUrl + this.configService.config.getproductdetailsandfeatures;
    return this.httpService.post(getproductdetailsandfeatures, reqBody);
  }
  updateMemberDetailsApi(reqBody: any){
    const updateMemberDetails = this.configService.config.baseUrl1 + this.configService.config.updateMemberDetails;
    return this.httpService.post(updateMemberDetails, reqBody);
  }
  paymentGatewayApi(reqBody:any){
    const paymentGateway = this.configService.config.baseUrl + this.configService.config.paymentGateway;
    return this.httpService.post(paymentGateway, reqBody);
  }
  kycUpdate(reqBody:any){
    const updateKycValue = this.configService.config.baseUrl + this.configService.config.kycUpdate;
    return this.httpService.post(updateKycValue, reqBody);
  }
  getkycURL(reqBody:any, options?: any){
    const kycURL = this.configService.config.baseUrl1 + this.configService.config.getkycURL;
    return this.httpService.post(kycURL, reqBody,options);
  }
  getPaymentStatusApi(orderId:any,reqBody:any){
    const paymentStatus = `${this.configService.config.baseUrl}${this.configService.config.getPaymentStatus}?orderId=${orderId}`;
    return this.httpService.post(paymentStatus,reqBody)
  }

  getPaymentDetails(reqBody:any){
    const paymentDetails = this.configService.config.baseUrl1 + this.configService.config.getPaymentDetails;
    return this.httpService.post(paymentDetails,reqBody);
  }
  getFullQuoteApi(reqBody:any){
    const fullquote = this.configService.config.baseUrl1 + this.configService.config.fullQuote;
    return this.httpService.post(fullquote, reqBody);
  }
  cpRedirectionApi(reqBody:any){
    const reDirectionLink = this.configService.config.baseUrl1 + this.configService.config.cpRedirectionApi;
    return this.httpService.post(reDirectionLink, reqBody);
  }
  getKycDetailsApi(reqBody:any){
    const getKycDetails = this.configService.config.baseUrl1 + this.configService.config.getDetailsForKyc;
    return this.httpService.post(getKycDetails, reqBody);
  }
  sharekyclinkApi(reqBody:any){
    const sharekyclink = this.configService.config.baseUrl1 + this.configService.config.sharekyclink;
    return this.httpService.post(sharekyclink, reqBody);
  }
  skipKycLinkApi(reqBody:any){
    const skipkyclink = this.configService.config.baseUrl1 + this.configService.config.skipkyclink;
    return this.httpService.post(skipkyclink, reqBody);
  }
  justPayRedirection(reqData:any){
    const paymentRedirection= this.configService.config.baseUrl1 + this.configService.config.justPayRedirection;
    return this.httpService.post(paymentRedirection,reqData);
  }
  sharePaymentLinkApi(reqData:any){
    const sharePaymentLink= this.configService.config.baseUrl1 + this.configService.config.sharePaymentLink;
    return this.httpService.post(sharePaymentLink,reqData);
  }
  getpaymentdetailsbypolicynoApi(reqData:any){
    const getpaymentstatus= this.configService.config.baseUrl1 + this.configService.config.getpaymentdetailsbypolicyno;
    return this.httpService.post(getpaymentstatus,reqData);
  }

}