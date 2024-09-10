import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndorsementsService {
  constructor(private http:HttpClient) { }
  getEndorsementDetailsApi(reqBody: any) {
  return this.http.post<any>(`https://usp.monocept.ai/ClaimsEndorsement/api/Endorsement/EndorsementDetails`, reqBody);
  // return this.http.post<any>(`https://usp.monocept.ai/RenewalsAPI/renewal/getrenewallist`, reqBody);
  }
}
