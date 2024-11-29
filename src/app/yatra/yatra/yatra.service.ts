import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class YatraService {
  policyDetails: any;
  constructor(private configService: ConfigService,
    private httpService: HttpService) { }

  Getform(reqData: any) {
    const getform = this.configService.config.baseUrl + this.configService.config.getForm
    return this.httpService.post(getform, reqData)
  }
  getSalutation(){
    const  Salutation = this.configService.config.baseUrl + this.configService.config.getSalutation;
    console.log(Salutation);
    return this.httpService.get(Salutation);
  }
  getNatureOfDuty(){
    const natureOfDuties = this.configService.config.baseUrl + this.configService.config.getNatureOfDuty;
    return this.httpService.get(natureOfDuties);
  }
  getInsurerData(){
    const getInsurerData = this.configService.config.baseUrl + this.configService.config.getInsurerData;
    return this.httpService.get(getInsurerData);
  }
  getInsuredOccupation(){
    const getOccupation = this.configService.config.baseUrl + this.configService.config.getOccupation;
    return this.httpService.get(getOccupation);
  }
  getIdentification(){
    const getId = this.configService.config.baseUrl + this.configService.config.getId;
    return this.httpService.get(getId);
  }
  getProposerOccupation(){
    const getProposerOccupation = this.configService.config.baseUrl + this.configService.config.getProposerOccupation;
    return this.httpService.get(getProposerOccupation);
  }
  getNationality(){
    const getNationality = this.configService.config.baseUrl + this.configService.config.getNationality;
    return this.httpService.get(getNationality);
  }
  getGstRegistrationStatus(){
    const getGstRegistrationStatus = this.configService.config.baseUrl + this.configService.config.getGstRegistrationStatus;
    return this.httpService.get(getGstRegistrationStatus);
  }
  getMaritalStatus(){
    const  getMaritalStatus = this.configService.config.baseUrl + this.configService.config.getMaritalStatus;
    return this.httpService.get(getMaritalStatus);
  }
  getEducationType(){
    const  getEducationType = this.configService.config.baseUrl + this.configService.config.getEducationType;
    return this.httpService.get(getEducationType);
  }

  getNomineeRelationship(){
    const  getNomineeRelationShip = this.configService.config.baseUrl + this.configService.config.getNomineeRelationShip;
    return this.httpService.get(getNomineeRelationShip);
  }
  getAllBankDetails(){
    const  getAllBankDetails = this.configService.config.baseUrl + this.configService.config.getAllBankDetails;
    return this.httpService.get(getAllBankDetails);
  }

  getRelationship(){
    const  getRelationship = this.configService.config.baseUrl + this.configService.config.getRelationship;
    return this.httpService.get(getRelationship);
  }
  GetProposerRelationships(reqData:any){
    const  GetProposerRelationships = this.configService.config.baseUrl + this.configService.config.getProposerRelationships;
    return this.httpService.post(GetProposerRelationships,reqData)
  }
  Insertorupdateformdata(reqdata:any){
    const  insertorupdateformdata = this.configService.config.baseUrl + this.configService.config.insertOrUpdateFormData;
    return this.httpService.post(insertorupdateformdata,reqdata)
  }
  Insertorupdatejourneydetails(reqData:any){
    const  insertorupdatejourneydetails = this.configService.config.baseUrl + this.configService.config.insertOrUpdateJourneyDetails;
    return this.httpService.post(insertorupdatejourneydetails,reqData)
  }

  getAddOnPremium(reqData: any){
    const  CalculateAddonValue = this.configService.config.baseUrl + this.configService.config.calculateAddOnValue;
    return this.httpService.post(CalculateAddonValue,reqData);
  }
  getHalfQuote(reqData: any){
    const  GetHalfQuote = this.configService.config.baseUrl + this.configService.config.getHalfQuote;
    return this.httpService.post(GetHalfQuote,reqData);
  }
  getFullQuote(reqData: any){
    const  GetFullQuote = this.configService.config.baseUrl1 + this.configService.config.getFullQuote;
    // const getFullQuoteUrl='https://localhost:7070/api/getfullquote';
    return this.httpService.post(GetFullQuote,reqData);
  }
  GetKycDetails(reqData:any){
    // const getKycDetails=this.configService.config.baseUrl1 + this.configService.config.getKycDetails;
    const getKycDetails='https://localhost:7188/getkycdetails';
    return this.httpService.post<any>(getKycDetails,reqData);
  }
  GetCustomerDetailsViaPolicyNumber(reqData:any){
    const policyNumber=this.configService.config.baseUrl+this.configService.config.getPolicyNumberDetails;
    return this.httpService.post(policyNumber,reqData);
  }
  getBankCity(reqData:any){
    const getBankCity=this.configService.config.baseUrl+this.configService.config.getBankCity;
    return this.httpService.post(getBankCity,reqData);
  }
  getBranchDetails(reqData:any){
    const getBranchDetails=this.configService.config.baseUrl+this.configService.config.getBranchDetails;
    return this.httpService.post(getBranchDetails,reqData);
  }

  fetchPolicyDetailsFromFile(reqData:FormData){
    const fetchPolicyDetailsFromFile= this.configService.config.baseUrl+this.configService.config.fetchPolicyDetailsFromFile;
    return this.httpService.post(fetchPolicyDetailsFromFile,reqData);
  }

  justPayRedirection(reqData:any){
    const paymentRedirection= this.configService.config.baseUrl+this.configService.config.justPayRedirection;
    return this.httpService.post(paymentRedirection,reqData);
  }

  submitFeedback(reqData:any){
    const feedbackServiceURL = this.configService.config.baseUrl+this.configService.config.addfeedback;
    return this.httpService.post(feedbackServiceURL,reqData);
  }
  getRelations(){
    const  getRelationship = this.configService.config.axisBaseUrl + this.configService.config.getRelations;
    return this.httpService.get(getRelationship);
  }
  getProductCombinations(){
    const  getProductCombinations = this.configService.config.axisBaseUrl + this.configService.config.getProductCombination;
    return this.httpService.get(getProductCombinations);
  }
  getProposalDetails(reqData:any){
    const proposalDetails = this.configService.config.axisBaseUrl + this.configService.config.getBBProposalDetails;
    return this.httpService.post(proposalDetails,reqData);
  }
  getSumInsuredDetails(reqData:any){
    const suminsuredDetails = this.configService.config.axisBaseUrl + this.configService.config.getSumInsuredDetails;
    return this.httpService.post(suminsuredDetails,reqData);
  }
  getPremiumData(reqData:any){
    const premiumData = this.configService.config.axisBaseUrl + this.configService.config.getPremiumDetaiks;
    return this.httpService.post(premiumData,reqData);
  }
  getFamilyConstructData(reqData:any){
    const familyConstructData = this.configService.config.axisBaseUrl + this.configService.config.getFamilyConstruct;
    return this.httpService.post(familyConstructData,reqData);
  }
  saveBBCommonDraft(reqData:any){
    const saveCommonDraftData = this.configService.config.baseUrl + this.configService.config.saveBBCommonDraft;
    return this.httpService.post(saveCommonDraftData,reqData);
  }
  insertFullQuoteJson(reqData:any){
    const insertfullquotejson = this.configService.config.baseUrl + this.configService.config.insertfullquotejson;
    return this.httpService.post(insertfullquotejson,reqData);
  }
  getFullQuoteViaOfflinePayment(reqData:any){
    // const getfullquoteviaofflinepayment = this.configService.config.baseUrl1 + this.configService.config.getfullquoteviaofflinepayment;
    const getfullquoteviaofflinepayment = 'https://localhost:7070/getfullquoteviaofflinepayment';
    return this.httpService.post(getfullquoteviaofflinepayment,reqData);
  }
}
