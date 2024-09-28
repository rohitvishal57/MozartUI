import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdfsService {
  private baseUrl: string = 'https://usp.monocept.ai/';
  constructor(private http: HttpClient) {}
  checkADFSLogin(loginData: any) {
    return this.http.post<any>(this.baseUrl+'validateadfstoken', loginData);
  }
  checkCyberArkLogin(loginData: any) {
    return this.http.post<any>(this.baseUrl+'validatecyberarktoken', loginData);
  }
}
