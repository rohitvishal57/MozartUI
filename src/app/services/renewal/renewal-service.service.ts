import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RenewalServiceService {

  // Define BehaviorSubject with an initial value
  private stateSource = new BehaviorSubject<{ button: string, value?: any }>({ button: 'primary' });
  state$ = this.stateSource.asObservable();

  // Initialize policyNo BehaviorSubject with a default value (for example, 0 or any initial number)
  private policyNo = new BehaviorSubject<{ policyNo: string }>({ policyNo: "" });
  policy$ = this.policyNo.asObservable();

  // Add a BehaviorSubject to store the renewal info
  private renewalInfoSource = new BehaviorSubject<any>(null); // Initially set to null
  renewalInfo$ = this.renewalInfoSource.asObservable();

  constructor(private http: HttpClient) {}

  // Method to update the button state
  updateState(button: string, value?: any) {
    this.stateSource.next({ button, value });
  }

  // Method to update the policy number
  getPolicyNo(policyNo: string) {
    this.policyNo.next({ policyNo });
  }

    // Method to update the renewal info data
    setRenewalInfo(data: any) {
      this.renewalInfoSource.next(data);  // Store the data in the BehaviorSubject
      console.log("setRenewal" + data);

    }
  
    // Method to retrieve the renewal info data
    getRenewalInfo(): Observable<any> {
      console.log("getRenewal" + this.renewalInfo$);
      
      return this.renewalInfo$;  // Return the observable for components to subscribe to
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
  getRenewalInfoApi(policyNumber: string, requestBody: any) {
    return this.http.post<any>(`https://usp.monocept.ai/renewal/api/renewal/renewalinfo?policyNumber=${policyNumber}`, requestBody);
  }
  

}