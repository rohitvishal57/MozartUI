import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl: string = 'https://usp.monocept.ai/';
  // private baseUrl: string = 'http://20.235.250.168:8086/';

  constructor(private http: HttpClient, private router: Router, private configService: ConfigService) {}

  getAllBankDetails() {
    return this.http.get<any>(`${this.baseUrl}Banca/User/GetAllBankDetails`);
  }
  sendLoginRequest(loginData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/User/Login`, loginData);
  }
  sendAdminLoginRequest(loginData: any) {
    return this.http.post<any>(`${this.baseUrl}yatra/Banca/Admin/Login`, loginData);
  }

  getAllProductsViaBankCode(bankCode: any) {
    return this.http.get<any>(
      `${this.baseUrl}Banca/Product/GetAllProductsViaBankCode?bankCode=${bankCode}`
    );
  }
  getAllProductListViaBankCode(bankCode: number, insuranceTypeCode: number) {
    return this.http.get<any>(
      `${this.baseUrl}Banca/Product/GetAllProductListViaBankCode?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}`
    );
  }

 
  //Agent APi's
  sendAgentLoginRequestApi(loginData: any) {
    const sendAgentLoginRequestApi = this.configService.config.baseUrl + this.configService.config.partnerlogin;
    return this.http.post<any>(sendAgentLoginRequestApi, loginData);
  }

  getAllProducts(verticalCode: any, code: any) {
    return this.http.get<any>(
      `${this.baseUrl}Banca/Product/GetProduct?verticalCode=${verticalCode}&code=${code}`
    );
  }

  // getAllProductList(verticalCode: any, code: any, insuranceTypeCode: any) {
  //   return this.http.get<any>(
  //     `${this.baseUrl}Banca/Product/GetProductList?verticalCode=${verticalCode}&code=${code}&insuranceTypeCode=${insuranceTypeCode}`
  //   );
  // }
  Getproductlist(reqData:any){
    return this.http.post<any>(`${this.baseUrl}Yatra/api/product/getproductlist`,reqData)
  }
  Getproductlist2(reqData:any){
    return this.http.post<any>(`https://5765cf9e-4ee6-4c3d-80b9-1b4f14eb4794.mock.pstmn.io/abhi`,reqData)
  }
  Getproductlist3(reqData:any){
    return this.http.post<any>(`https://1762f1a5-b8b1-464d-bd9b-f0d6529b1304.mock.pstmn.io/Getproductlist3`,reqData)
  }
  // Getproductlist3(reqData:any){
  //   return this.http.post<any>(`https://1762f1a5-b8b1-464d-bd9b-f0d6529b1304.mock.pstmn.io/Getproductlist3`,reqData)
  // }
  Getformsequence(reqData:any){
    return this.http.post<any>(`${this.baseUrl}Yatra/api/forms/getformsequence`,reqData)
  }
  Getagentcartdetails(reqData:any){
    return this.http.post<any>(`${this.baseUrl}quote/api/cart/getagentcartdetails`,reqData);
  }
  Insertorupdateagentcartdetails(reqData:any){
    return this.http.post<any>(`${this.baseUrl}quote/api/cart/insertorupdateagentcartdetails`,reqData);
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
  getProposalNumber() {
    return this.http.get<any>(`${this.baseUrl}yatra/api/product/getproposalnumber`);
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
      const getContactDetailsByAgentCodeApi = this.configService.config.baseUrl + this.configService.config.getcontactdetailsbyagentcode;
      return this.http.post<any>(getContactDetailsByAgentCodeApi, contactDetailsReqBody);
    }
}
