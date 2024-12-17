import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';
@Injectable({
  providedIn: 'root'
})
export class ProposalsService {

  constructor( private http: HttpClient,
    private configService: ConfigService) { }
    getProposalListApi(reqBody: any) { 
    const getProposalListApi = this.configService.config.baseUrl + this.configService.config.getProposalListApi;
    return this.http.post<any>(getProposalListApi, reqBody);
  }
  getQuoteListApi(reqBody: any) { 
    const getQuoteListApi = this.configService.config.baseUrl + this.configService.config.getQuoteListApi;
    return this.http.post<any>(getQuoteListApi, reqBody);
  }

}
