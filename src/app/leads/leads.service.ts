import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http:HttpClient, private configService: ConfigService) { }

  getLeadsListApi(requestBody:any):Observable<any>{
    const getProposalListApi = this.configService.config.baseUrl + this.configService.config.getLeadsListApi;
    return this.http.post<any>(getProposalListApi, requestBody);
  }
  getActiveCampaignDetails(requestBody: any):Observable<any>{
    const getProposalListApi = this.configService.config.baseUrl + this.configService.config.getActiveCampaignDetails;
    return this.http.post<any>(getProposalListApi, requestBody);
  }
  saveLeadData(requestBody:any):Observable<any>{
    const saveLeadDataApi = this.configService.config.baseUrl + this.configService.config.saveLeadData;
    return this.http.post<any>(saveLeadDataApi, requestBody);
  }

  getCampaignListApi(requestBody:any):Observable<any>{
    const getCampaignListApi = this.configService.config.baseUrl + this.configService.config.getcampaignsdetails;
    return this.http.post<any>(getCampaignListApi, requestBody);
  }

  uploadfile(file: any) {
    return this.http.post<any>(`${this.configService.config.baseUrl}${this.configService.config.createbulklead}`, file)
      .pipe(map(data => {
        return data;
      }));
  }

  
}
