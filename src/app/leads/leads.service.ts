import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private http:HttpClient, private configService: ConfigService, private httpService: HttpService) { }

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

  getMyReportingUsers(requestBody:any):Observable<any>{
    const getMyReportingUsersAPI = this.configService.config.baseUrl + this.configService.config.getMyReportingUsers;
    return this.http.post<any>(getMyReportingUsersAPI, requestBody);
  }

  assineLead(requestBody:any):Observable<any>{
    const assineLead = this.configService.config.baseUrl + this.configService.config.assineLead;
    return this.http.post<any>(assineLead, requestBody);
  }
  
  addLeadNotes(requestBody:any):Observable<any>{
    const addLeadNotesRequest = this.configService.config.baseUrl + this.configService.config.addLeadNotes;
    return this.http.post<any>(addLeadNotesRequest, requestBody);
  }

  getLeadNotes(leadnumber: string):Observable<any>{
    const url = `${this.configService.config.baseUrl}${this.configService.config.getLeadNotes}${leadnumber}`;
    return this.http.post<any>(url,leadnumber);
  }
  
  getLeadInfoByLeadID(requestBody:any):Observable<any>{
    const addLeadNotesRequest = this.configService.config.baseUrl + this.configService.config.getLeadsListApi;
    return this.http.post<any>(addLeadNotesRequest, requestBody);
  }
  
  viewAuditTrail(leadnumber: string) {
    const url = `${this.configService.config.baseUrl}${this.configService.config.viewaudittrail}${leadnumber}`;
    return this.http.post<any>(url, leadnumber);
  }
  getReferenceStatus() {
    const url = `${this.configService.config.baseUrl}${this.configService.config.referencestatus}`;
    return this.httpService.get<any>(url);
  }
  updateStatus(requestBody:any):Observable<any>{
    const updateStatusRequest = this.configService.config.baseUrl + this.configService.config.updatestatus;
    return this.http.post<any>(updateStatusRequest, requestBody);
  }
  getDuplicateLead(requestBody:any):Observable<any>{
    const getDuplicateLeadRequest = this.configService.config.baseUrl + this.configService.config.getduplicateLead;
    return this.http.post<any>(getDuplicateLeadRequest, requestBody);
  }

  fetchActivityType(requestBody:any):Observable<any>{
    const getDuplicateLeadRequest = this.configService.config.baseUrl + this.configService.config.fetchActivityType;
    return this.http.post<any>(getDuplicateLeadRequest, requestBody);
  }

  
}
