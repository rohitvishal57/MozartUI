import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class RugService {

  private isHeadersD2CShow = new BehaviorSubject<boolean>(false);
  currentStatus = this.isHeadersD2CShow.asObservable();
  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

    changeStatus(flag: boolean) {
      this.isHeadersD2CShow.next(flag);
    }

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
      const  getAllDispositions = this.configService.config.baseUrl1 + this.configService.config.getAllDispositions;
      return this.httpService.get(getAllDispositions);
    }
    getAllSubDispositions(reqData:any){
      const  getSubDispositions = this.configService.config.baseUrl1 + this.configService.config.getAllSubDispositions;
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
    getBBPolicyInfoByLeadId(reqData: any) {
      const suminsuredDetails = this.configService.config.baseUrl1 + this.configService.config.getBBPolicyInfoByLeadId;
      return this.httpService.post(suminsuredDetails, reqData);
    }
    bbHalfQuote(reqData: any) {
      const halfQuoteData = this.configService.config.baseUrl1 + this.configService.config.bbHalfQuote;
      return this.httpService.post(halfQuoteData, reqData);
    }
    getBaseCallerDetails(reqData: any){
      const baseCallerData = this.configService.config.baseUrl1 + this.configService.config.getBaseCallerDetails;
      return this.httpService.post(baseCallerData, reqData);
    }
    getAllLeads(reqData: any) {
      const halfQuoteData = this.configService.config.baseUrl1 + this.configService.config.GetLeads;
      return this.httpService.post(halfQuoteData, reqData);
    }
    getMasterData() {
      const getProposerOccupation = this.configService.config.baseUrl + this.configService.config.getMasterData;
      return this.httpService.get(getProposerOccupation);
    }

    checkGroupRenewalData(reqData: any) {
      const halfQuoteData = this.configService.config.baseUrl1 + this.configService.config.checkGroupRenewalData;
      return this.httpService.post(halfQuoteData, reqData);
    }

    getProfileDetails(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.profileDetails;
      return this.httpService.post(req,reqData);
    }
    SaveRenewalProposalData(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.SaveRenewalProposalData;
      return this.httpService.post(req,reqData);
    }
    getRetailRenewalRedirectUrl(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.getRetailRenewalRedirectUrl;
      return this.httpService.post(req,reqData);
    }
    sendLinkToCustomer(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.sendLinkToCustomer;
      return this.httpService.post(req,reqData);
    }
    sendRetailLinkToCustomer(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.sendRetailLinkToCustomer;
      return this.httpService.post(req,reqData);
    }
    getRetailRenewalPhaseTwoLeads(reqData : any) {
      const req = this.configService.config.baseUrl + this.configService.config.getRetailRenewalPhaseTwoLeads;
      return this.httpService.post(req,reqData);
    }
    getRenewalPolicyData(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.getRenewalPolicyData;
      return this.httpService.post(req,reqData);
    }
    getGroupRenewalPhaseTwoLeads(reqData : any) {
      const req = this.configService.config.baseUrl1 + this.configService.config.getGroupRenewalPhaseTwoLeads;
      return this.httpService.post(req,reqData);
    }

    getDispositionsRenewal(){
      const  getAllDispositions = this.configService.config.baseUrl1 + this.configService.config.getAllDispositionsRenewal;
      return this.httpService.get(getAllDispositions);
    }
}
