import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http:HttpClient) { }

  getLeadsListApi(requestBody:any):Observable<any>{
    return this.http.post(`https://usp.monocept.ai/yatra/api/getLeadDetailsList`, requestBody);
  }
}
