import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RenewalServiceService {

  private stateSource = new BehaviorSubject<{ button: string, value?: any }>({ button: 'primary' });
  state$ = this.stateSource.asObservable();

  constructor(private http: HttpClient) { }

  updateState(button: string, value?: any) {
    this.stateSource.next({ button, value });
  }

  getRenewalListApi(reqBody: any) {
    return this.http.post<any>(`https://usp.monocept.ai/renewal/api/renewal/getrenewallist`, reqBody);
  }

  sendrenewalwhatappsms(reqBody: any) {
    return this.http.post<any>(`https://usp.monocept.ai/renewal/api/renewal/sendrenewalwhatappsms`, reqBody);
  }

  sendrenewalsms(reqBody: any) {
    return this.http.post<any>(`https://usp.monocept.ai/renewal/api/renewal/sendrenewalsms`, reqBody);
  }
  
  generatepaymentlink(reqBody: any) {
    return this.http.post<any>(`https://usp.monocept.ai/renewal/api/renewal/generatepaymentlink`, reqBody);
  }

}
