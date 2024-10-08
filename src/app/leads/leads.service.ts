import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  getLeadsListApi(requestBody:any):Observable<any>{
    const getProposalListApi = this.configService.config.baseUrl + this.configService.config.getLeadsList;
    return this.http.post<any>(getProposalListApi, requestBody);
  }
}
