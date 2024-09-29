import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdfsService {
  private baseUrl: string = 'https://usp.monocept.ai/auth/api/';
  constructor(private http: HttpClient) {}
  checkADFSLogin(loginData: any, token:any) {
    return this.http.post<any>(this.baseUrl+'validateadfstoken?Idtoken='+token, loginData);
  }
  checkCyberArkLogin(loginData: any, token:any) {
    return this.http.post<any>(this.baseUrl+'validatecyberarktoken?Idtoken='+token, loginData);
  }
}
