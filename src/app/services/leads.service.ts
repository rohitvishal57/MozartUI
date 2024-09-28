import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  getLeadsListApi(requestBody:any):Observable<any>{
    const getProposalListApi = this.configService.config.baseUrl + this.configService.config.getLeadsListApi;
    return this.http.post<any>(getProposalListApi, requestBody);
  }
}
