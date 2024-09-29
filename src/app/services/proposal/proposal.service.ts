import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  constructor( private http: HttpClient,
    private configService: ConfigService) { }
    getProposalListApi(reqBody: any) { 
    const getProposalListApi = this.configService.config.baseUrl + this.configService.config.getProposalListApi;
    return this.http.post<any>(getProposalListApi, reqBody);
  }
}
