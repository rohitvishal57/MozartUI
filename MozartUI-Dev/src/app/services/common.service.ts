import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private baseUrl: string = 'https://usp.monocept.ai/api/';
  // private baseUrl: string = 'http://20.235.250.168:8086/';

  public baseCssUrl= 	'https://usp.monocept.ai/ABHI/' 

  private apiUrl = './assets/health-plans.json';
  private apiUrl1 = './assets/occupations.json';

  constructor(private http: HttpClient) { }

  getFormConfig(bankCode: number, insuranceTypeCode: number, productId: any) {
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetFormConfig?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}`);
  }
  getJSONForm(bankCode: any, insuranceTypeCode: number, productId: any, formId: number) {
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetJSONForm?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}&formId=${formId}`);
  }
  insertFormConfig(formConfig: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/InsertFormConfigViaVerticalCode`, formConfig);
  }
  insertJSONForm(jsonForm: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/InsertJSONFormViaVerticalCode`, jsonForm);
  }
  insertOrUpdateFormData(formData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/InsertOrUpdateFormData`, formData);
  }
  getFormData(bankCode: any, insuranceTypeCode: number, productId: any, formId: number, proposalNumber: any) {
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetFormData?bankCode=${bankCode}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}&formId=${formId}&proposalNumber=${proposalNumber}`);
  }
  getAllFormData(bankCode: any) {
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetAllFormData?bankCode=${bankCode}`);
  }
  //Agents

  getFormConfigViaVerticalCode(verticalCode: number, Code: number, insuranceTypeCode: number, productId: string) {
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetFormConfigViaVerticalCode?verticalCode=${verticalCode}&Code=${Code}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}`);
  }

  getJSONFormViaVerticalCode(verticalCode: any, Code: number, insuranceTypeCode: number, productId: string, formId: number) {
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetJSONFormViaVerticalCode?verticalCode=${verticalCode}&Code=${Code}&insuranceTypeCode=${insuranceTypeCode}&productId=${productId}&formId=${formId}`);
  }

  insertOrUpdateFormDataViaVertical(formData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/InsertOrUpdateFormDataViaVerticalCode`, formData);
  }

  getAllFormDataViaVerticalCode(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/GetAllFormDataViaVerticalCode`, reqData);
  }

  insertOrUpdateJourneyDetailsViaVerticalCode(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/InsertOrUpdateJourneyDetailsViaVerticalCode`, reqData);
  }
  getJourneyDetailsByProposalNum(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/GetJourneyDetailsByProposalNum`, reqData);
  }
  getJourneyDetailsViaVerticalCode(verticalCode:any,code:any,agentCode:any){
    return this.http.get<any>(`${this.baseUrl}Banca/Forms/GetJourneyDetailsViaVerticalCode?verticalCode=${verticalCode}&Code=${code}&AgentCode=${agentCode}`);
  }
  resumeJourneyViaFormName(reqData: any){
    return this.http.post<any>(`${this.baseUrl}Banca/Forms/ResumeJourneyViaFormName`,reqData);
  }

  //For ABHI

  //Agent Forms Api's

  // For All PartnerApi
   getQoute(reqData: any) {
    console.log(reqData);

    return this.http.post<any>(`${this.baseUrl}getHealthQuote`, reqData);
  }

  getActiveFitQoute(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}getHealthQuoteForAF`, reqData);
  }
  getAllStates() {
    return this.http.post<any>(`${this.baseUrl}getStates`, {});
  }
  getAllRelationship(){
    return this.http.post<any>(`${this.baseUrl}getRelationShip`,{});
  }
  getCityByPinCode(pinCode: any) {
    const headers = { 'content-type': 'application/json' };
    return this.http.post<any>(`${this.baseUrl}getPinCode`, pinCode, { 'headers': headers });
  }
  getPinCodeByCity(pincode: any) {
    return this.http.get<any>(`${this.baseUrl}Agent/Agency/GetPincodeDetails?pincode=${pincode}`);
  }

  getHealthPlans(year: any, adultCount: any, childCount: any) {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  CreateProposal(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}Banca/PartnerApi/CreateProposal`, reqData);
  }
  convertToRDBMS(data: any) {
    const data1 = JSON.stringify(data);
    const headers = { 'content-type': 'application/json' }
    return this.http.post(`${this.baseUrl}Banca/Forms/ConvertToRDBMS`, data1, { 'headers': headers });
  }
  //For ICICI
  getOccupations() {
    return this.http.get<any>(`${this.apiUrl1}`);
  }

  //For ABHI
  getAllOccupation(){
    return this.http.get<any>(`${this.baseUrl}Agent/getOccupation`);
  }

  getAllOccupationRisk(){
    return this.http.get<any>(`${this.baseUrl}Agent/getRiskOccupation`);
  }

  getAllBankDetails(){
    return this.http.get<any>(`${this.baseUrl}Agent/getAllBankDetails`);
  }

  getBankCity(reqBody:any){
    return this.http.post<any>(`${this.baseUrl}getBankCity`,reqBody);
  }

  getBranchDetails(reqBody:any){
    return this.http.post<any>(`${this.baseUrl}getBranchDetails`,reqBody);
  }

  convertData(reqData: any,reqType: number){
    return this.http.post<any>(`${this.baseUrl}Agent/ConvertData?dataType=${reqType}`,reqData);

  }

  draftSave(reqData: any){
    return this.http.post<any>(`${this.baseUrl}draftSave`,reqData);
  }

  saveLeadDetails(reqData: any){
    return this.http.post<any>(`${this.baseUrl}saveLeadDetails`,reqData);
  }
  insertLeadDetails(reqData: any) {
    return this.http.post<any>(`${this.baseUrl}Agent/Agency/InsertLeadDetails`, reqData);
  }

  commonDraftSave(reqData:any){
    return this.http.post<any>(`${this.baseUrl}commonDraftSave`,reqData);
  }

  getTotalPremiumEncrypted(reqData: number){
    console.log(reqData);
    let res = this.http.post<any>(`${this.baseUrl}encrypt`,reqData,{responseType: 'text' as 'json'});
    console.log(res);
    
    return res;
    
  }

  getAddOnPremium(reqData: any){
    return this.http.post<any>(`${this.baseUrl}Agent/CalculateAddonValue`,reqData);
  }

  getIdentification(){
    return this.http.get<any>(`${this.baseUrl}Agent/getId`);
  }

  getProposerOccupation(){
    return this.http.get<any>(`${this.baseUrl}Agent/getProposerOccupation`);
  }

  getProposerRelationships(reqData: any){
    return this.http.post<any>(`${this.baseUrl}Agent/getProposerRelationships`,reqData);
  }
  
  getNatureOfOccupation(){
    return this.http.get<any>(`${this.baseUrl}Agent/GetNatureOfWork`);
  }

  getNationality(){
    return this.http.get<any>(`${this.baseUrl}Agent/getNationality`);
  }

  getGstRegistrationStatus(){
    return this.http.get<any>(`${this.baseUrl}Agent/getGstRegistrationStatus`);
  }

  getSalutation(){
    return this.http.get<any>(`${this.baseUrl}Agent/getSalutation`);
  }

  getMaritalStatus(){
    return this.http.get<any>(`${this.baseUrl}Agent/getMaritalStatus`);
  }

  getEducationType(){
    return this.http.get<any>(`${this.baseUrl}Agent/getEducationType`);
  }

  getNomineeRelationship(){
    return this.http.get<any>(`${this.baseUrl}Agent/getNomineeRelationShip`);
  }

  getRelationship(){
    return this.http.get<any>(`${this.baseUrl}Agent/getRelationship`);
  }

  getHalfQuotation(reqData: any){
    return this.http.post<any>(`${this.baseUrl}getHalfQuote`,reqData);
  }
  getHalfQuote(reqData: any){
    return this.http.post<any>(`${this.baseUrl}Agent/Agency/GetHalfQuote`,reqData);
  }
  getFullQuote(reqData: any){
    return this.http.post<any>(`${this.baseUrl}Agent/Agency/GetHalfQuote`,reqData);
  }
  getInsurerData(){
    return this.http.get<any>(`${this.baseUrl}Agent/GetInsurerData`);
  }
  
    //claims
    getClaimsList(data: any): Observable<any>{
      return this.http.post('https://usp.monocept.ai/ClaimsEndorsement/api/claim/getclaimlist',data);
     }
}
