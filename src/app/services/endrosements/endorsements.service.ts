import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndorsementsService {
  constructor(private http:HttpClient) { }
  getEndorsementDetailsApi(reqBody: any) {
  return this.http.post<any>(`https://usp.monocept.ai/claims/api/endorsement/endorsementdetails`, reqBody);
  }
}
