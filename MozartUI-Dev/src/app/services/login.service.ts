import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl: string = 'https://usp.monocept.ai/api/';
  // private baseUrl: string = 'http://20.235.250.168:8086/';

  constructor(private http: HttpClient, private router: Router) {}

  getAllBankDetails() {
    return this.http.get<any>(`${this.baseUrl}Banca/User/GetAllBankDetails`);
  }
  sendLoginRequest(loginData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/User/Login`, loginData);
  }
  sendAdminLoginRequest(loginData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Admin/Login`, loginData);
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
  sendAgentLoginRequest(loginData: any) {
    return this.http.post<any>(
      `${this.baseUrl}Banca/User/Agent/AgentLogin`,
      loginData
    );
  }

  getAllProducts(verticalCode: any, code: any) {
    return this.http.get<any>(
      `${this.baseUrl}Banca/Product/GetProduct?verticalCode=${verticalCode}&code=${code}`
    );
  }

  getAllProductList(verticalCode: any, code: any, insuranceTypeCode: any) {
    return this.http.get<any>(
      `${this.baseUrl}Banca/Product/GetProductList?verticalCode=${verticalCode}&code=${code}&insuranceTypeCode=${insuranceTypeCode}`
    );
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
    return this.http.get<any>(`${this.baseUrl}Banca/Product/GetProposalNumber`);
  }

  // For Google Login
  sendGoogleLoginRequest(reqBody: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/User/GoogleLogin`, reqBody);
  }
}
