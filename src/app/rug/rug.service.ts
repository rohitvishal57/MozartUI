import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class RugService {

  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

    createLeadTS(reqData:any){
      const  createLead = this.configService.config.baseUrl1 + this.configService.config.tsCreateLead;
      return this.httpService.post(createLead,reqData)
    }
    getLobDetails(){
      const  getAllManageLOB = this.configService.config.baseUrl1 + this.configService.config.getAllManageLob;
      console.log(getAllManageLOB);
      return this.httpService.get(getAllManageLOB);
    }
    getDispositions(){
      const  getAllDispositions = this.configService.config.baseUrl + this.configService.config.getAllDispositions;
      return this.httpService.get(getAllDispositions);
    }
    getAllSubDispositions(reqData:any){
      const  getSubDispositions = this.configService.config.baseUrl + this.configService.config.getAllSubDispositions;
      return this.httpService.post(getSubDispositions,reqData)
    }
    getDataPincodeDetails(reqData:any){
      const  getPincodeDetails = this.configService.config.baseUrl + this.configService.config.getPincodeDetails;
      return this.httpService.post(getPincodeDetails,reqData)
    }
    saveTsCommonDraft(reqData:any){
      const saveTsCommonDraftData = this.configService.config.baseUrl1 + this.configService.config.saveTSCommonDraft;
      return this.httpService.post(saveTsCommonDraftData,reqData);
    }
    postTsHalfQuote(reqData:any){
      const tsHalfQuoteData = this.configService.config.baseUrl1 + this.configService.config.postTSHalfQuote;
      return this.httpService.post(tsHalfQuoteData,reqData);
    }
    getTsPolicyInfoByLeadId(reqData:any){
      const policyInfoByLeadIdData = this.configService.config.baseUrl1 + this.configService.config.getTSPolicyInfoByLeadId;
      return this.httpService.post(policyInfoByLeadIdData,reqData);
    }
}
