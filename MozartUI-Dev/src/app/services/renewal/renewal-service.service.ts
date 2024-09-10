import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RenewalServiceService {

  constructor(private http:HttpClient) { }

  getRenewalListApi(reqBody: any) {
    // return this.http.post<any>(`https://usp.monocept.ai:7210/api/Renewal/GetRenewalsList`, reqBody);
    return this.http.post<any>(`https://usp.monocept.ai/RenewalsAPI/renewal/getrenewallist`, reqBody);
  }
}
